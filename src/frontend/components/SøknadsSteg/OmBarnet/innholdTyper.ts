import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    omBarnetTittel: LocaleRecordBlock;
    borBarnFastSammenMedDeg: ISanitySpørsmålDokument;
    opplystBarnehageplass: LocaleRecordBlock;
    bosted: LocaleRecordString;
    barnetsAndreForelder: LocaleRecordString;
    fastBosted: LocaleRecordBlock;
    deltBosted: ISanitySpørsmålDokument;
    periodeBarnehageplass: LocaleRecordBlock;
    barnXAvY: LocaleRecordBlock;
    paagaaendeSoeknadYtelse: ISanitySpørsmålDokument;
    hvilketLandYtelse: ISanitySpørsmålDokument;
    planlagtBoSammenhengendeINorge: ISanitySpørsmålDokument;
    utbetaltForeldrepengerEllerEngangsstoenad: ISanitySpørsmålDokument;
    opplystBarnOppholdUtenforNorge: LocaleRecordBlock;
    opplystFaarHarFaattEllerSoektYtelse: LocaleRecordBlock;
    /* Andre forelder */
    navnAndreForelder: ISanitySpørsmålDokument;
    foedselsnummerDnummerAndreForelder: ISanitySpørsmålDokument;
    foedselsdatoAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelder: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelderGjenlevende: ISanitySpørsmålDokument;
    medlemAvFolktetrygdenAndreForelder: ISanitySpørsmålDokument;
}
