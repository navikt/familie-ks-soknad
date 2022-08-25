import React, { useState } from 'react';

import dayjs from 'dayjs';

import AlertStripe, { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = dayjs(vedleggTidspunkt).add(46, 'hours');
    return dayjs().isBefore(grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus, tekster } = useApp();
    const { sendInnSkjema } = useSendInnSkjema();
    const [slettaVedlegg, settSlettaVedlegg] = useState<IVedlegg[]>([]);

    const {
        [ESanitySteg.DOKUMENTASJON]: { dokumentasjonTittel },
    } = tekster();

    const oppdaterDokumentasjon = (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => {
        settSøknad(prevState => ({
            ...prevState,
            dokumentasjon: prevState.dokumentasjon.map(dok =>
                dok.dokumentasjonsbehov === dokumentasjonsbehov
                    ? { ...dok, opplastedeVedlegg, harSendtInn }
                    : dok
            ),
        }));
    };

    // Fjern vedlegg som evt. har blitt slettet i familie-dokument
    useFørsteRender(() => {
        søknad.dokumentasjon.forEach((dok: IDokumentasjon) => {
            if (dok.opplastedeVedlegg) {
                const gyldigeVedlegg = dok.opplastedeVedlegg.filter(vedlegg =>
                    erVedleggstidspunktGyldig(vedlegg.tidspunkt)
                );
                const ugyldigeVedlegg = dok.opplastedeVedlegg.filter(
                    vedlegg => !gyldigeVedlegg.includes(vedlegg)
                );

                if (gyldigeVedlegg.length !== dok.opplastedeVedlegg.length) {
                    settSlettaVedlegg(prevState => [prevState, ugyldigeVedlegg].flat());
                    oppdaterDokumentasjon(dok.dokumentasjonsbehov, gyldigeVedlegg, dok.harSendtInn);
                }
            }
        });
    });

    return (
        <Steg
            tittel={<TekstBlock block={dokumentasjonTittel.tittel} />}
            gåVidereCallback={async () => {
                const [success, _] = await sendInnSkjema();
                return success;
            }}
        >
            {slettaVedlegg.length > 0 && (
                <KomponentGruppe>
                    <AlertStripeAdvarsel>
                        <Normaltekst>
                            <SpråkTekst id={'dokumentasjon.forlangtid.info'} />
                        </Normaltekst>
                        <ul>
                            {slettaVedlegg.map(vedlegg => (
                                <li key={vedlegg.dokumentId}>
                                    <Normaltekst>{vedlegg.navn}</Normaltekst>
                                </li>
                            ))}
                        </ul>
                    </AlertStripeAdvarsel>
                </KomponentGruppe>
            )}
            <KomponentGruppe>
                <AlertStripe type={'info'}>
                    <SpråkTekst id={'dokumentasjon.nudge'} />
                </AlertStripe>

                <Normaltekst>
                    <SpråkTekst id={'dokumentasjon.info'} />
                </Normaltekst>
                <PictureScanningGuide />
            </KomponentGruppe>
            {søknad.dokumentasjon
                .filter(dokumentasjon => erDokumentasjonRelevant(dokumentasjon))
                .map((dokumentasjon, index) => (
                    <LastOppVedlegg
                        key={index}
                        vedleggNr={index + 1}
                        dokumentasjon={dokumentasjon}
                        oppdaterDokumentasjon={oppdaterDokumentasjon}
                    />
                ))}
            {innsendingStatus.status === RessursStatus.FEILET && <Feilside />}
        </Steg>
    );
};

export default Dokumentasjon;
