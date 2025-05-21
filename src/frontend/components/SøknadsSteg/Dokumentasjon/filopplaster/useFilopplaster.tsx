import { useState } from 'react';

import axios from 'axios';

import {
    type FileAccepted,
    type FileObject,
    type FileRejected,
    type FileRejectionReason,
} from '@navikt/ds-react';

import Miljø from '../../../../../shared-utils/Miljø';
import { EFiltyper, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { PlainTekst } from '../../../../typer/kontrakt/generelle';
import { IDokumentasjonTekstinnhold } from '../innholdTyper';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

export enum EStandardFileRejectionReasons {
    FIL_TYPE = 'fileType',
    FIL_STØRRELSE_FOR_STOR = 'fileSize',
}

export enum ECustomFileRejectionReasons {
    FIL_DIMENSJONER_FOR_LITEN = 'filDimensjonerForLiten',
    MAKS_ANTALL_FILER_NÅDD = 'maksAntallFilerNådd',
    UKJENT_FEIL = 'ukjentFeil',
}

const filtrerFiler = (
    filer: FileObject[],
    antallEksisterendeFiler: number,
    maksAntallFiler: number
): { aksepterteFiler: FileAccepted[]; feilendeFiler: FileRejected[] } => {
    const filerUtenFeil: FileAccepted[] = filer.filter(file => !file.error);
    const filerMedFeil: FileRejected[] = filer.filter(file => file.error);

    const ikkeForMangeFiler = antallEksisterendeFiler + filerUtenFeil.length <= maksAntallFiler;

    if (ikkeForMangeFiler) {
        return { aksepterteFiler: filerUtenFeil, feilendeFiler: filerMedFeil };
    } else {
        const ledigePlasser = maksAntallFiler - antallEksisterendeFiler;

        const aksepterteFiler = filerUtenFeil.slice(0, ledigePlasser);

        const filerOverMaksAntall = filerUtenFeil.slice(aksepterteFiler.length);
        const filerOverMaksAntallMedFeil: FileRejected[] = filerOverMaksAntall.map(fil => ({
            file: fil.file,
            error: true,
            reasons: [ECustomFileRejectionReasons.MAKS_ANTALL_FILER_NÅDD],
        }));

        const feilendeFiler = [...filerMedFeil, ...filerOverMaksAntallMedFeil];

        return { aksepterteFiler, feilendeFiler };
    }
};

enum BadRequestCode {
    IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
    IMAGE_DIMENSIONS_TOO_SMALL = 'IMAGE_DIMENSIONS_TOO_SMALL',
    INVALID_DOCUMENT_FORMAT = 'INVALID_DOCUMENT_FORMAT',
}

// Meldingsfeltet på respons ved BadRequest inneholder tekst på følgende format: CODE=ENUM_NAVN
const badRequestCodeFraError = (error): BadRequestCode | undefined => {
    const melding = error.response?.data?.melding;
    if (melding) {
        return BadRequestCode[melding.split('=')[1]];
    }
    return;
};

const feilmeldingFraError = (error): string => {
    const badRequestCode = badRequestCodeFraError(error);
    switch (badRequestCode) {
        case BadRequestCode.IMAGE_DIMENSIONS_TOO_SMALL:
            return ECustomFileRejectionReasons.FIL_DIMENSJONER_FOR_LITEN;
        case BadRequestCode.IMAGE_TOO_LARGE:
            return EStandardFileRejectionReasons.FIL_STØRRELSE_FOR_STOR;
        case BadRequestCode.INVALID_DOCUMENT_FORMAT:
            return EStandardFileRejectionReasons.FIL_TYPE;
        default:
            return ECustomFileRejectionReasons.UKJENT_FEIL;
    }
};

export const useFilopplaster = (
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void,
    dokumentasjonTekster: IDokumentasjonTekstinnhold,
    plainTekst: PlainTekst
) => {
    const [filerUnderOpplastning, setFilerUnderOpplastning] = useState<FileObject[]>([]);
    const [avvisteFiler, setAvvsiteFiler] = useState<FileRejected[]>([]);

    const MAKS_FILSTØRRELSE_MB = 10;
    const MAKS_FILSTØRRELSE_BYTES = MAKS_FILSTØRRELSE_MB * 1024 * 1024;
    const MAKS_ANTALL_FILER = 25;
    const STØTTEDE_FILTYPER = [EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG, EFiltyper.PDF];

    const feilmeldinger: Record<FileRejectionReason | ECustomFileRejectionReasons, string> = {
        [EStandardFileRejectionReasons.FIL_TYPE]: plainTekst(
            dokumentasjonTekster.filtypeFeilmelding
        ),
        [EStandardFileRejectionReasons.FIL_STØRRELSE_FOR_STOR]: `${plainTekst(dokumentasjonTekster.filstorrelseFeilmelding)} ${MAKS_FILSTØRRELSE_MB} MB`,
        [ECustomFileRejectionReasons.FIL_DIMENSJONER_FOR_LITEN]: plainTekst(
            dokumentasjonTekster.bildetForLite
        ),
        [ECustomFileRejectionReasons.MAKS_ANTALL_FILER_NÅDD]: `${plainTekst(dokumentasjonTekster.antallFilerFeilmelding)} ${MAKS_ANTALL_FILER}`,
        [ECustomFileRejectionReasons.UKJENT_FEIL]: plainTekst(
            dokumentasjonTekster.ukjentFeilmelding
        ),
    };

    const dagensDatoStreng = new Date().toISOString();

    const leggTilVedlegg = async (nyeFiler: FileObject[]) => {
        const { aksepterteFiler, feilendeFiler } = filtrerFiler(
            nyeFiler,
            dokumentasjon.opplastedeVedlegg.length,
            MAKS_ANTALL_FILER
        );

        if (feilendeFiler.length > 0) {
            setAvvsiteFiler(eksisterendeAvvisteFiler => [
                ...eksisterendeAvvisteFiler,
                ...feilendeFiler,
            ]);
        }

        if (aksepterteFiler.length > 0) {
            setFilerUnderOpplastning(aksepterteFiler);

            const aksepterteVedlegg: IVedlegg[] = [];
            const feilendeVedlegg: FileRejected[] = [];

            await Promise.all(
                aksepterteFiler.map((fil: FileAccepted) => {
                    const requestData = new FormData();
                    requestData.append('file', fil.file);

                    return axios
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
                            const nyttVedlegg: IVedlegg = {
                                dokumentId: data.dokumentId,
                                navn: fil.file.name,
                                størrelse: fil.file.size,
                                tidspunkt: dagensDatoStreng,
                            };
                            aksepterteVedlegg.push(nyttVedlegg);
                        })
                        .catch(error => {
                            const filMedFeil: FileRejected = {
                                file: fil.file,
                                error: true,
                                reasons: [feilmeldingFraError(error)],
                            };
                            feilendeVedlegg.push(filMedFeil);
                        });
                })
            );

            if (aksepterteVedlegg.length > 0) {
                oppdaterDokumentasjon(
                    dokumentasjon.dokumentasjonsbehov,
                    [...dokumentasjon.opplastedeVedlegg, ...aksepterteVedlegg],
                    dokumentasjon.harSendtInn
                );
            }

            if (feilendeVedlegg.length > 0) {
                setAvvsiteFiler(eksisterendeAvvisteFiler => [
                    ...eksisterendeAvvisteFiler,
                    ...feilendeVedlegg,
                ]);
            }

            setFilerUnderOpplastning([]);
        }
    };

    const fjernVedlegg = (vedleggSomSkalFjernes: IVedlegg) => {
        const nyVedleggsliste = dokumentasjon.opplastedeVedlegg.filter(
            (eksisterendeVedlegg: IVedlegg) =>
                eksisterendeVedlegg.dokumentId !== vedleggSomSkalFjernes.dokumentId
        );

        oppdaterDokumentasjon(
            dokumentasjon.dokumentasjonsbehov,
            nyVedleggsliste,
            dokumentasjon.harSendtInn
        );
    };

    const fjernAvvistFil = (fil: FileRejected) => {
        setAvvsiteFiler(avvisteFiler.filter(file => file !== fil));
    };

    const fjernAlleAvvisteFiler = () => {
        setAvvsiteFiler([]);
    };

    const prøvOpplastingAvAvvistFilPåNytt = (fil: FileRejected) => {
        fjernAvvistFil(fil);
        const filUtenFeil: FileAccepted = {
            file: fil.file,
            error: false,
        };
        leggTilVedlegg([filUtenFeil]);
    };

    return {
        filerUnderOpplastning,
        avvisteFiler,
        MAKS_FILSTØRRELSE_MB,
        MAKS_FILSTØRRELSE_BYTES,
        MAKS_ANTALL_FILER,
        STØTTEDE_FILTYPER,
        feilmeldinger,
        leggTilVedlegg,
        fjernVedlegg,
        fjernAvvistFil,
        fjernAlleAvvisteFiler,
        prøvOpplastingAvAvvistFilPåNytt,
    };
};
