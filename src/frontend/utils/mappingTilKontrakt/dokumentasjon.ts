import {
    dokumentasjonsbehovTilTittelSanityApiNavn,
    IDokumentasjon,
    IVedlegg,
} from '../../typer/dokumentasjon';
import {
    Dokumentasjonsbehov,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktVedlegg,
} from '../../typer/kontrakt/dokumentasjon';
import { TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';

export const dokumentasjonISøknadFormat = (
    dokumentasjon: IDokumentasjon,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): ISøknadKontraktDokumentasjon => {
    const dokumentsjonstekster = tekster[ESanitySteg.DOKUMENTASJON];
    return {
        dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
        harSendtInn: dokumentasjon.harSendtInn,
        opplastedeVedlegg: dokumentasjon.opplastedeVedlegg.map(vedlegg =>
            vedleggISøknadFormat(vedlegg, dokumentasjon.dokumentasjonsbehov)
        ),
        dokumentasjonSpråkTittel: tilRestLocaleRecord(
            dokumentsjonstekster[
                dokumentasjonsbehovTilTittelSanityApiNavn(dokumentasjon.dokumentasjonsbehov)
            ]
        ),
    };
};

export const vedleggISøknadFormat = (
    vedlegg: IVedlegg,
    dokumentasjonsbehov: Dokumentasjonsbehov
): ISøknadKontraktVedlegg => ({
    navn: vedlegg.navn,
    dokumentId: vedlegg.dokumentId,
    tittel: dokumentasjonsbehov,
});
