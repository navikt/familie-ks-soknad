import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';

export interface IVedleggOppsummering {
    skalVises: boolean;
    dokumentasjonsbehov: Dokumentasjonsbehov;
    flettefeltVerdier?: FlettefeltVerdier;
}
