import React, { useEffect, useRef } from 'react';

import { format } from 'date-fns';

import { Alert, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { Typografi } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { RouteEnum } from '../../../typer/routes';
import { setUserProperty, UserProperty } from '../../../utils/amplitude';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import Kontoinformasjon from '../../Kontoinformasjon/Kontoinformasjon';

const Kvittering: React.FC = () => {
    const {
        avbrytOgSlettSøknad,
        sisteUtfylteStegIndex,
        settFåttGyldigKvittering,
        søknad,
        tekster,
    } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const { hentStegNummer } = useSteg();

    const { innsendingStatus } = useApp();
    const innsendtDato: Date =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : new Date();

    const klokkeslett = format(innsendtDato, 'HH:mm');
    const dato = format(innsendtDato, 'dd.MM.yy');

    const alleRelevanteVedleggErSendtInn = useRef(
        søknad.dokumentasjon.filter(
            dokumentasjon =>
                dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON &&
                erDokumentasjonRelevant(dokumentasjon) &&
                !dokumentasjon.harSendtInn
        ).length === 0
    );

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);

            // I tilfelle vi kommer via mellomlagring og ikke har satt denne fra før, sett den her før vi nullstiller søknaden
            setUserProperty(UserProperty.ANTALL_VALGTE_BARN, barnInkludertISøknaden.length);

            avbrytOgSlettSøknad();
        }
    }, []);

    const kvitteringTekster = tekster().KVITTERING;

    return (
        <Steg tittel={<TekstBlock block={kvitteringTekster.kvitteringTittel} />}>
            <Alert variant="success">
                <TekstBlock
                    block={kvitteringTekster.soeknadMottatt}
                    flettefelter={{ dato, klokkeslett }}
                />
            </Alert>

            <VStack gap="6">
                {alleRelevanteVedleggErSendtInn.current ? (
                    <TekstBlock
                        block={kvitteringTekster.trengerIkkeEttersendeVedlegg}
                        typografi={Typografi.BodyLong}
                    />
                ) : (
                    <Alert variant="warning">
                        <TekstBlock block={kvitteringTekster.maaEttersendeVedleggAlert} />
                    </Alert>
                )}
                <TekstBlock block={kvitteringTekster.infoTilSoker} typografi={Typografi.BodyLong} />
            </VStack>

            <Kontoinformasjon />
            <div data-uxsignals-embed="panel-3p9qfalb7a" style={{ maxWidth: '620px' }}></div>
            <script src="https://widget.uxsignals.com/embed.js"></script>
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
