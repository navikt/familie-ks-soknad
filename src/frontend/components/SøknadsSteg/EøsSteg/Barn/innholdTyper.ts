import { LocaleRecordBlock } from '../../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../../typer/sanity/sanity';

export interface IEøsForBarnTekstinnhold {
    eoesForBarnTittel: LocaleRecordBlock;
    idNummerBarn: ISanitySpørsmålDokument;

    /* Andre forelder */
    arbeidNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelder: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    utbetalingerAndreForelder: ISanitySpørsmålDokument;
    utbetalingerAndreForelderGjenlevende: ISanitySpørsmålDokument;
    idNummerAndreForelder: ISanitySpørsmålDokument;

    /* Omsorgsperson */
    arbeidUtenforNorgeOmsorgsperson: ISanitySpørsmålDokument;
    arbeidNorgeOmsorgsperson: ISanitySpørsmålDokument;
    pensjonNorgeOmsorgsperson: ISanitySpørsmålDokument;
    pensjonUtlandOmsorgsperson: ISanitySpørsmålDokument;
    utbetalingerOmsorgsperson: ISanitySpørsmålDokument;
}
