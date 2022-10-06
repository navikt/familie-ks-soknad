import { LocaleRecordBlock } from '../../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../../typer/sanity/sanity';

export interface IEøsForBarnTekstinnhold {
    eoesForBarnTittel: LocaleRecordBlock;

    /* Andre forelder */
    arbeidNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelder: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;

    /* Omsorgsperson */
    arbeidUtenforNorgeOmsorgsperson: ISanitySpørsmålDokument;
    arbeidNorgeOmsorgsperson: ISanitySpørsmålDokument;
    pensjonNorgeOmsorgsperson: ISanitySpørsmålDokument;
    pensjonUtlandOmsorgsperson: ISanitySpørsmålDokument;
}
