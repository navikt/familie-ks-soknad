import { ReactNode, useCallback, useState } from 'react';

import axios from 'axios';
import { FileRejection } from 'react-dropzone';

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

export const useFilopplaster = (
    maxFilstørrelse: number,
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void
) => {
    const { wrapMedSystemetLaster } = useLastRessurserContext();
    const { tekster, plainTekst } = useApp();
    const [feilmeldinger, settFeilmeldinger] = useState<ReactNode[]>([]);
    const [åpenModal, settÅpenModal] = useState<boolean>(false);

    const dokumentasjonTekster = tekster().DOKUMENTASJON;

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        async (filer: File[], filRejections: FileRejection[]) => {
            const feilmeldingsliste: ReactNode[] = [];
            const nyeVedlegg: IVedlegg[] = [];

            const pushFeilmelding = (feilmelding: LocaleRecordString, fil: File) => {
                feilmeldingsliste.push(
                    `${plainTekst(feilmelding)} ${plainTekst(dokumentasjonTekster.fil)} ${fil.name}`
                );
            };

            if (filRejections.length > 0) {
                filRejections.map((filRejection: FileRejection) => {
                    pushFeilmelding(dokumentasjonTekster.feilFiltype, filRejection.file);
                });
            }

            await Promise.all(
                filer.map((fil: File) =>
                    wrapMedSystemetLaster(async () => {
                        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
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
                            .catch(_error => {
                                pushFeilmelding(dokumentasjonTekster.noeGikkFeil, fil);
                            });
                    })
                )
            );

            if (feilmeldingsliste.length > 0) {
                settFeilmeldinger(feilmeldingsliste);
                settÅpenModal(true);
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

    const lukkModal = () => {
        settÅpenModal(false);
    };

    return {
        onDrop,
        åpenModal,
        settÅpenModal,
        feilmeldinger,
        slettVedlegg,
        lukkModal,
    };
};
