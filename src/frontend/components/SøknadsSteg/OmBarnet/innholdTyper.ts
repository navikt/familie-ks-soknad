import { LocaleRecordBlock } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    omBarnetTittel: LocaleRecordBlock;
    institusjonNaarAvsluttes: ISanitySpørsmålDokument;
    institusjonNaarStartet: ISanitySpørsmålDokument;
    foedselsdatoAndreForelder: ISanitySpørsmålDokument;

    /* Andre forelder */
    arbeidUtenforNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
}
