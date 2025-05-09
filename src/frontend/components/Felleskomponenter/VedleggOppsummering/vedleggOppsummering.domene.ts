import { PlainTekst } from '../../../typer/kontrakt/generelle';
import { IFrittståendeOrdTekstinnhold } from '../../../typer/sanity/tekstInnhold';
import { slåSammen } from '../../../utils/slåSammen';

import { IVedleggOppsummering } from './vedleggOppsummering.types';

export const hentVedleggSomSkalVises = (
    vedlegg: IVedleggOppsummering[]
): IVedleggOppsummering[] => {
    return vedlegg.filter(enkeltVedlegg => enkeltVedlegg.skalVises);
};

export const skalVedleggOppsummeringVises = (vedlegg: IVedleggOppsummering[]): boolean => {
    return vedlegg.filter(enkeltVedlegg => enkeltVedlegg.skalVises).length > 0;
};

export const hentVedleggOppsummering = (
    dokumentasjoner,
    søknad,
    plainTekst: PlainTekst,
    frittståendeOrdTekster: IFrittståendeOrdTekstinnhold
): IVedleggOppsummering[] =>
    dokumentasjoner.map(dokumentasjon => {
        const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
            dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
        );
        const barnasNavn = slåSammen(
            barnDokGjelderFor.map(barn => barn.navn),
            plainTekst,
            frittståendeOrdTekster
        );

        return {
            skalVises: true,
            dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
            flettefeltVerdier: { barnetsNavn: barnasNavn },
        };
    });
