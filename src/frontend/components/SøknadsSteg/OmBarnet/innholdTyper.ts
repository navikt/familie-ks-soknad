import { LocaleRecordBlock } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    omBarnetTittel: LocaleRecordBlock;
    institusjonNaarAvsluttes: ISanitySpørsmålDokument;
    institusjonNaarStartet: ISanitySpørsmålDokument;
    foedselsdatoAndreForelder: ISanitySpørsmålDokument;
    opplystBarnehageplass: LocaleRecordBlock;

    /* Andre forelder */
    arbeidUtenforNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelder: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelderGjenlevende: ISanitySpørsmålDokument;
}
