import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { FlettefeltVerdier } from '../../../../common/typer/kontrakt/generelle';

export interface IVedleggOppsummering {
    skalVises: boolean;
    dokumentasjonsbehov: Dokumentasjonsbehov;
    flettefeltVerdier?: FlettefeltVerdier;
}
