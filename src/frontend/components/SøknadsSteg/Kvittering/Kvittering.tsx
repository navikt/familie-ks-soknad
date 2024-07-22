import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';

import { Alert } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { Typografi } from '../../../typer/common';
import { RouteEnum } from '../../../typer/routes';
import { setUserProperty, UserProperty } from '../../../utils/amplitude';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

const Kvittering: React.FC = () => {
    const {
        avbrytOgSlettSøknad,
        sisteUtfylteStegIndex,
        settFåttGyldigKvittering,
        søknad,
        tekster,
    } = useApp();
    const { barnInkludertISøknaden, erEøs } = søknad;
    const { hentStegNummer } = useSteg();

    const { innsendingStatus } = useApp();
    const innsendtDato: Date =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : new Date();

    const klokkeslett = format(innsendtDato, 'HH:mm');
    const dato = format(innsendtDato, 'dd.MM.yy');
    const [varEøsSøknad] = useState(erEøs);

    const kvitteringTekster = tekster().KVITTERING;

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);

            // I tilfelle vi kommer via mellomlagring og ikke har satt denne fra før, sett den her før vi nullstiller søknaden
            setUserProperty(UserProperty.ANTALL_VALGTE_BARN, barnInkludertISøknaden.length);

            avbrytOgSlettSøknad();
        }
    }, []);

    return (
        <Steg tittel={<TekstBlock block={kvitteringTekster.kvitteringTittel} />}>
            <KomponentGruppe>
                <Alert variant="success">
                    <TekstBlock
                        block={kvitteringTekster.soeknadMottatt}
                        flettefelter={{ dato, klokkeslett }}
                    />
                </Alert>
            </KomponentGruppe>
            <KomponentGruppe>
                <TekstBlock
                    block={kvitteringTekster.infoTilSoker}
                    typografi={Typografi.BodyShort}
                />
            </KomponentGruppe>

            {varEøsSøknad && (
                <KomponentGruppe>
                    <TekstBlock block={kvitteringTekster.kontonummerEOES} />
                </KomponentGruppe>
            )}

            <TekstBlock block={kvitteringTekster.ettersendelseKontantstotte} />
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
