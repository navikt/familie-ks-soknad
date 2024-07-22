import React, { useState } from 'react';

import { add, isBefore } from 'date-fns';

import { Alert, BodyShort } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { Typografi } from '../../../typer/common';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = add(new Date(vedleggTidspunkt), { hours: 46 });
    return isBefore(new Date(), grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus, tekster } = useApp();
    const { sendInnSkjema } = useSendInnSkjema();
    const { toggles } = useFeatureToggles();
    const [slettaVedlegg, settSlettaVedlegg] = useState<IVedlegg[]>([]);

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

    const stegTekster = tekster()[ESanitySteg.DOKUMENTASJON];
    const { dokumentasjonGuide } = stegTekster;

    const visNyGuide = toggles.VIS_GUIDE_I_STEG && dokumentasjonGuide;

    return (
        <Steg
            tittel={<TekstBlock block={dokumentasjonTittel} />}
            guide={<TekstBlock block={dokumentasjonGuide} />}
            gåVidereCallback={async () => {
                const [success, _] = await sendInnSkjema();
                return success;
            }}
        >
            {slettaVedlegg.length > 0 && (
                <KomponentGruppe>
                    <Alert variant={'warning'} inline>
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
                    </Alert>
                </KomponentGruppe>
            )}
            {visNyGuide ? (
                <KomponentGruppe>
                    <PictureScanningGuide />
                </KomponentGruppe>
            ) : (
                <KomponentGruppe>
                    <Alert variant={'info'}>
                        <TekstBlock block={nudgeDokumentasjon} typografi={Typografi.BodyLong} />
                    </Alert>

                    <TekstBlock block={dokumentasjonInfo} typografi={Typografi.BodyLong} />
                    <PictureScanningGuide />
                </KomponentGruppe>
            )}
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
