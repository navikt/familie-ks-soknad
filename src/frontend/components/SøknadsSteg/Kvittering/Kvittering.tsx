import React, { useEffect, useRef } from 'react';

import { format } from 'date-fns';

import { Alert, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useAppContext } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import useUxSignals from '../../../hooks/useUxSignals';
import { Typografi } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { RouteEnum } from '../../../typer/routes';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import Kontoinformasjon from '../../Kontoinformasjon/Kontoinformasjon';

const Kvittering: React.FC = () => {
    const { avbrytOgSlettSøknad, sisteUtfylteStegIndex, settFåttGyldigKvittering, søknad, tekster } = useAppContext();
    const { hentStegNummer } = useStegContext();

    const { innsendingStatus } = useAppContext();
    const innsendtDato: Date =
        innsendingStatus.status === RessursStatus.SUKSESS ? new Date(innsendingStatus.data.mottattDato) : new Date();

    const klokkeslett = format(innsendtDato, 'HH:mm');
    const dato = format(innsendtDato, 'dd.MM.yy');

    const allNødvendigDokumentasjonErLastetOpp = useRef(
        !søknad.dokumentasjon.find(
            dokumentasjon =>
                dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON &&
                erDokumentasjonRelevant(dokumentasjon) &&
                !(dokumentasjon.harSendtInn || dokumentasjon.opplastedeVedlegg.length > 0)
        )
    );

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);
            avbrytOgSlettSøknad();
        }
    }, []);

    const kvitteringTekster = tekster().KVITTERING;

    useUxSignals(true);

    return (
        <Steg tittel={<TekstBlock block={kvitteringTekster.kvitteringTittel} />}>
            <Alert variant="success">
                <TekstBlock block={kvitteringTekster.soeknadMottatt} flettefelter={{ dato, klokkeslett }} />
            </Alert>

            <VStack gap="6">
                {allNødvendigDokumentasjonErLastetOpp.current ? (
                    <TekstBlock block={kvitteringTekster.trengerIkkeEttersendeVedlegg} typografi={Typografi.BodyLong} />
                ) : (
                    <Alert variant="warning">
                        <TekstBlock block={kvitteringTekster.maaEttersendeVedleggAlert} />
                    </Alert>
                )}
                <TekstBlock block={kvitteringTekster.infoTilSoker} typografi={Typografi.BodyLong} />
            </VStack>

            <Kontoinformasjon />
            <div data-uxsignals-embed="panel-3p9qfalb7a" style={{ maxWidth: '620px' }}></div>
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
