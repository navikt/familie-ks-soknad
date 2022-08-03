import React, { ReactNode, useCallback, useState } from 'react';

import axios from 'axios';
import { fromBlob } from 'file-type/browser';

import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import Miljø from '../../../../Miljø';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { formaterFilstørrelse } from '../../../../utils/dokumentasjon';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { konverter } from './konverteringService';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

export const useFilopplaster = (
    maxFilstørrelse: number,
    tillatteFiltyper: string[],
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void
) => {
    const { wrapMedSystemetLaster } = useLastRessurserContext();
    const [feilmeldinger, settFeilmeldinger] = useState<ReactNode[]>([]);
    const [åpenModal, settÅpenModal] = useState<boolean>(false);

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        async filer => {
            const feilmeldingsliste: ReactNode[] = [];
            const nyeVedlegg: IVedlegg[] = [];
            await Promise.all(
                filer.map((fil: File) =>
                    wrapMedSystemetLaster(async () => {
                        const mimeType = await fromBlob(fil);
                        if (
                            !tillatteFiltyper.includes(mimeType?.mime ?? '') &&
                            mimeType?.mime.match(/^image\//)
                        ) {
                            try {
                                fil = await konverter(fil);
                            } catch (e) {
                                fil = new File([fil], fil.name, { type: mimeType.mime });
                            }
                        }

                        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
                            const maks = formaterFilstørrelse(maxFilstørrelse);
                            feilmeldingsliste.push(
                                <SpråkTekst
                                    id={'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor'}
                                    values={{ maks, filnavn: fil.name }}
                                />
                            );

                            settFeilmeldinger(feilmeldingsliste);
                            settÅpenModal(true);
                            return;
                        }

                        if (tillatteFiltyper && !tillatteFiltyper.includes(fil.type)) {
                            feilmeldingsliste.push(
                                <SpråkTekst
                                    id={'dokumentasjon.last-opp-dokumentasjon.feilmeldingtype'}
                                    values={{ filnavn: fil.name }}
                                />
                            );
                            settFeilmeldinger(feilmeldingsliste);
                            settÅpenModal(true);
                            return;
                        }

                        const requestData = new FormData();
                        requestData.append('file', fil);

                        await axios
                            .post<OpplastetVedlegg>(`${Miljø().dokumentUrl}`, requestData, {
                                withCredentials: true,
                                headers: {
                                    'content-type': 'multipart/form-data',
                                    accept: 'application/json',
                                },
                            })
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
                                feilmeldingsliste.push(
                                    <SpråkTekst
                                        id={
                                            'dokumentasjon.last-opp-dokumentasjon.feilmeldinggenerisk'
                                        }
                                        values={{ filnavn: fil.name }}
                                    />
                                );

                                settFeilmeldinger(feilmeldingsliste);
                                settÅpenModal(true);
                            });
                    })
                )
            );

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
