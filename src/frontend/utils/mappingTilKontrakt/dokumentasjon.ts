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
            flettefelterForDokumentasjonTittel(dokumentasjon.dokumentasjonsbehov, søknad)
        ),
    };
};

const flettefelterForDokumentasjonTittel = (
    dokumentasjonsbehov: Dokumentasjonsbehov,
    søknad: ISøknad
): FlettefeltVerdier => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return { barnetsNavn: slåSammen(søknad.barnRegistrertManuelt.map(barn => barn.navn)) };
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
