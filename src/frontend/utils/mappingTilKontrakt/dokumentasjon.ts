import { dokumentasjonsbehovTilSpråkId, IDokumentasjon, IVedlegg } from '../../typer/dokumentasjon';
import {
    Dokumentasjonsbehov,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktVedlegg,
} from '../../typer/kontrakt/dokumentasjon';
import { hentTekster } from '../språk';

export const dokumentasjonISøknadFormat = (
    dokumentasjon: IDokumentasjon
): ISøknadKontraktDokumentasjon => ({
    dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
    harSendtInn: dokumentasjon.harSendtInn,
    opplastedeVedlegg: dokumentasjon.opplastedeVedlegg.map(vedlegg =>
        vedleggISøknadFormat(vedlegg, dokumentasjon.dokumentasjonsbehov)
    ),
    dokumentasjonSpråkTittel:
        dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.BOR_FAST_MED_SØKER
            ? hentTekster('pdf.vedlegg.bekreftelse-barn-bor-med-deg.tittel')
            : hentTekster(dokumentasjonsbehovTilSpråkId(dokumentasjon.dokumentasjonsbehov)),
});

export const vedleggISøknadFormat = (
    vedlegg: IVedlegg,
    dokumentasjonsbehov: Dokumentasjonsbehov
): ISøknadKontraktVedlegg => ({
    navn: vedlegg.navn,
    dokumentId: vedlegg.dokumentId,
    tittel: dokumentasjonsbehov,
});
