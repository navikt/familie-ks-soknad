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
import { FlettefeltVerdier, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { slåSammen } from '../slåSammen';

export const dokumentasjonISøknadFormat = (
    dokumentasjon: IDokumentasjon,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord,
    søknad: ISøknad
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
            ],
            flettefelterForDokumentasjonTittel(dokumentasjon, søknad)
        ),
    };
};

const flettefelterForDokumentasjonTittel = (
    dokumentasjon: IDokumentasjon,
    søknad: ISøknad
): FlettefeltVerdier => {
    switch (dokumentasjon.dokumentasjonsbehov) {
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            const barnDokumentasjonsbehovGjelderFor = søknad.barnInkludertISøknaden
                .filter(barn => dokumentasjon.gjelderForBarnId.find(id => barn.id === id))
                .map(barn => barn.navn);
            return {
                barnetsNavn: slåSammen(barnDokumentasjonsbehovGjelderFor),
            };
        default:
            return {};
    }
};

export const vedleggISøknadFormat = (
    vedlegg: IVedlegg,
    dokumentasjonsbehov: Dokumentasjonsbehov
): ISøknadKontraktVedlegg => ({
    navn: vedlegg.navn,
    dokumentId: vedlegg.dokumentId,
    tittel: dokumentasjonsbehov,
});
