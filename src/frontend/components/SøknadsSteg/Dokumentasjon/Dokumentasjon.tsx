import React, { useState } from 'react';

import { add, isBefore } from 'date-fns';

import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { Typografi } from '../../../typer/common';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { slåSammen } from '../../../utils/slåSammen';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import {
    IVedleggOppsummeringProps,
    VedleggOppsummering,
} from '../../Felleskomponenter/VedleggOppsummering';

import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = add(new Date(vedleggTidspunkt), { hours: 46 });
    return isBefore(new Date(), grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus, tekster, plainTekst } = useApp();
    const { sendInnSkjema } = useSendInnSkjema();
    const [slettaVedlegg, settSlettaVedlegg] = useState<IVedlegg[]>([]);

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

    const relevateDokumentasjoner = søknad.dokumentasjon.filter(dokumentasjon =>
        erDokumentasjonRelevant(dokumentasjon)
    );

    const relevateDokumentasjonerUtenAnnenDokumentasjon = relevateDokumentasjoner.filter(
        dokumentasjon =>
            dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    const brukerHarVedleggskrav = relevateDokumentasjonerUtenAnnenDokumentasjon.length > 0;

    const vedleggOppsummering: IVedleggOppsummeringProps['vedlegg'] =
        relevateDokumentasjonerUtenAnnenDokumentasjon.map(dokumentasjon => {
            const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
                dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
            );
            const barnasNavn = slåSammen(barnDokGjelderFor.map(barn => barn.navn));

            return {
                skalVises: true,
                dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
                flettefeltVerdier: { barnetsNavn: barnasNavn },
            };
        });

    const stegTekster = tekster()[ESanitySteg.DOKUMENTASJON];

    return (
        <Steg
            tittel={<TekstBlock block={stegTekster.dokumentasjonTittel} />}
            guide={
                <TekstBlock
                    block={
                        brukerHarVedleggskrav
                            ? stegTekster.dokumentasjonGuideVedleggskrav
                            : stegTekster.dokumentasjonGuideIngenVedleggskrav
                    }
                />
            }
            gåVidereCallback={async () => {
                const [success, _] = await sendInnSkjema();
                return success;
            }}
        >
            <VStack gap="12">
                {slettaVedlegg.length > 0 && (
                    <Alert variant={'warning'}>
                        <TekstBlock
                            block={stegTekster.forLangTidDokumentasjon}
                            typografi={Typografi.BodyLong}
                        />
                        <ul>
                            {slettaVedlegg.map(vedlegg => (
                                <li key={vedlegg.dokumentId}>
                                    <BodyShort>{vedlegg.navn}</BodyShort>
                                </li>
                            ))}
                        </ul>
                    </Alert>
                )}
                {brukerHarVedleggskrav ? (
                    <>
                        <div>
                            <Heading level="3" size="medium" spacing>
                                {plainTekst(stegTekster.vedleggskravTittel)}
                            </Heading>
                            <VedleggOppsummering vedlegg={vedleggOppsummering} />
                            <TekstBlock
                                block={stegTekster.vedleggskrav}
                                typografi={Typografi.BodyLong}
                            />
                        </div>
                        <PictureScanningGuide />
                        <div>
                            <Heading level="3" size="medium" spacing>
                                {plainTekst(stegTekster.manglerDokumentasjonSpoersmaalTittel)}
                            </Heading>
                            <TekstBlock
                                block={stegTekster.manglerDokumentasjonSpoersmaal}
                                typografi={Typografi.BodyLong}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <Heading level="3" size="medium" spacing>
                                {plainTekst(stegTekster.ingenVedleggskravTittel)}
                            </Heading>
                            <TekstBlock
                                block={stegTekster.ingenVedleggskrav}
                                typografi={Typografi.BodyLong}
                            />
                        </div>
                        <PictureScanningGuide />
                    </>
                )}
                {relevateDokumentasjoner.map((dokumentasjon, index) => (
                    <LastOppVedlegg
                        key={index}
                        vedleggNr={index + 1}
                        dokumentasjon={dokumentasjon}
                        oppdaterDokumentasjon={oppdaterDokumentasjon}
                    />
                ))}
                {innsendingStatus.status === RessursStatus.FEILET && <Feilside />}
            </VStack>
        </Steg>
    );
};

export default Dokumentasjon;
