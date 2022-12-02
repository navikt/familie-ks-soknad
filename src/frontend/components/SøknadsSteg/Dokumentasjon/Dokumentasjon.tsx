import React, { useState } from 'react';

import dayjs from 'dayjs';

import { BodyShort } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { Typografi } from '../../../typer/common';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
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
    const { toggles } = useFeatureToggles();

    const { dokumentasjonInfo, dokumentasjonTittel, forLangTidDokumentasjon, nudgeDokumentasjon } =
        tekster().DOKUMENTASJON;

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
            tittel={<TekstBlock block={dokumentasjonTittel} typografi={Typografi.StegHeadingH1} />}
            gåVidereCallback={
                !toggles.DISABLE_SEND_INN_KNAPP
                    ? async () => {
                          const [success, _] = await sendInnSkjema();
                          return success;
                      }
                    : undefined
            }
        >
            {slettaVedlegg.length > 0 && (
                <KomponentGruppe>
                    <AlertStripe variant={'warning'}>
                        <TekstBlock
                            block={forLangTidDokumentasjon}
                            typografi={Typografi.BodyLong}
                        />
                        <ul>
                            {slettaVedlegg.map(vedlegg => (
                                <li key={vedlegg.dokumentId}>
                                    <BodyShort>{vedlegg.navn}</BodyShort>
                                </li>
                            ))}
                        </ul>
                    </AlertStripe>
                </KomponentGruppe>
            )}
            <KomponentGruppe>
                <AlertStripe variant={'info'} inline={false}>
                    <TekstBlock block={nudgeDokumentasjon} typografi={Typografi.BodyLong} />
                </AlertStripe>

                <TekstBlock block={dokumentasjonInfo} typografi={Typografi.BodyLong} />
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
            {toggles.DISABLE_SEND_INN_KNAPP && (
                <div>
                    <AlertStripe variant="error">
                        <BodyShort>
                            Denne siden er under utvikling og du kan derfor ikke sende inn en søknad
                        </BodyShort>
                    </AlertStripe>
                </div>
            )}
        </Steg>
    );
};

export default Dokumentasjon;
