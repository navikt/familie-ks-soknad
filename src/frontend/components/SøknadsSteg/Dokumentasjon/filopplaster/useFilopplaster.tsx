import { useCallback, useState } from 'react';

import axios from 'axios';
import type { FileRejection } from 'react-dropzone';

import Miljø from '../../../../../shared-utils/Miljø';
import { useApp } from '../../../../context/AppContext';
import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import { LocaleRecordString } from '../../../../typer/common';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

enum BadRequestCode {
    IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
    IMAGE_DIMENSIONS_TOO_SMALL = 'IMAGE_DIMENSIONS_TOO_SMALL',
}

// Meldingsfeltet på respons ved BadRequest inneholder tekst på følgende format: CODE=ENUM_NAVN
const badRequestCodeFraError = (error): BadRequestCode | undefined => {
    const melding = error.response?.data?.melding;
    if (melding) {
        return BadRequestCode[melding.split('=')[1]];
    }
    return;
};

const MAKS_FILSTØRRELSE = 1024 * 1024 * 10; // 10 MB
const MAKS_ANTALL_FILER = 25;

export const useFilopplaster = (
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void
) => {
    const { wrapMedSystemetLaster } = useLastRessurserContext();
    const { tekster, søknad } = useApp();
    const [feilmeldinger, settFeilmeldinger] = useState<Map<LocaleRecordString, File[]>>(new Map());
    const [harFeil, settHarFeil] = useState<boolean>(false);

    const dokumentasjonTekster = tekster().DOKUMENTASJON;

    const antallOpplastedeVedlegg = (): number =>
        søknad.dokumentasjon.reduce(
            (antallVedlegg: number, dokumentasjon: IDokumentasjon) =>
                antallVedlegg + dokumentasjon.opplastedeVedlegg.length,
            0
        );

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        async (filer: File[], filRejections: FileRejection[]) => {
            if (
                filer.length > MAKS_ANTALL_FILER ||
                filer.length + antallOpplastedeVedlegg() > MAKS_ANTALL_FILER
            ) {
                settFeilmeldinger(new Map().set(dokumentasjonTekster.forMange, []));
                settHarFeil(true);
                return;
            }
            const nyeVedlegg: IVedlegg[] = [];
            const feilmeldingMap: Map<LocaleRecordString, File[]> = new Map();

            const pushFeilmelding = (feilmelding: LocaleRecordString, fil: File) => {
                if (!feilmeldingMap.has(feilmelding)) {
                    feilmeldingMap.set(feilmelding, []);
                }
                const filer = feilmeldingMap.get(feilmelding);
                if (filer) {
                    filer.push(fil);
                    feilmeldingMap.set(feilmelding, filer);
                }
            };

            if (filRejections.length > 0) {
                filRejections.map((filRejection: FileRejection) => {
                    pushFeilmelding(dokumentasjonTekster.feilFiltype, filRejection.file);
                });
            }

            await Promise.all(
                filer.map((fil: File) =>
                    wrapMedSystemetLaster(async () => {
                        if (fil.size > MAKS_FILSTØRRELSE) {
                            pushFeilmelding(dokumentasjonTekster.forStor, fil);
                            return;
                        }

                        const requestData = new FormData();
                        requestData.append('file', fil);

                        await axios
                            .post<OpplastetVedlegg>(
                                `${Miljø().dokumentProxyUrl}/mapper/familievedlegg`,
                                requestData,
                                {
                                    withCredentials: true,
                                    headers: {
                                        'content-type': 'multipart/form-data',
                                        accept: 'application/json',
                                    },
                                }
                            )
                            .then((response: { data: OpplastetVedlegg }) => {
                                const { data } = response;
                                nyeVedlegg.push({
                                    dokumentId: data.dokumentId,
                                    navn: fil.name,
                                    størrelse: fil.size,
                                    tidspunkt: dagensDatoStreng,
                                });
                            })
                            .catch(error => {
                                const badRequestCode = badRequestCodeFraError(error);
                                switch (badRequestCode) {
                                    case BadRequestCode.IMAGE_TOO_LARGE:
                                        pushFeilmelding(dokumentasjonTekster.forStor, fil);
                                        break;
                                    case BadRequestCode.IMAGE_DIMENSIONS_TOO_SMALL:
                                        pushFeilmelding(dokumentasjonTekster.bildetForLite, fil);
                                        break;
                                    default:
                                        pushFeilmelding(dokumentasjonTekster.noeGikkFeil, fil);
                                }
                            });
                    })
                )
            );

            if (feilmeldingMap.size > 0) {
                settFeilmeldinger(feilmeldingMap);
                settHarFeil(true);
            }

            oppdaterDokumentasjon(
                dokumentasjon.dokumentasjonsbehov,
                [...dokumentasjon.opplastedeVedlegg, ...nyeVedlegg],
                dokumentasjon.harSendtInn
            );
        },
        [dokumentasjon.opplastedeVedlegg]
    );

    const slettVedlegg = (fil: IVedlegg) => {
        const nyVedleggsliste = dokumentasjon.opplastedeVedlegg.filter((obj: IVedlegg) => {
            return obj.dokumentId !== fil.dokumentId;
        });
        oppdaterDokumentasjon(
            dokumentasjon.dokumentasjonsbehov,
            nyVedleggsliste,
            dokumentasjon.harSendtInn
        );
    };

    return {
        onDrop,
        harFeil,
        feilmeldinger,
        slettVedlegg,
    };
};
