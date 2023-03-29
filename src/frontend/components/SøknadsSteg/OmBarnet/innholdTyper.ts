import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    omBarnetTittel: LocaleRecordBlock;
    borBarnFastSammenMedDeg: ISanitySpørsmålDokument;
    paagaaendeSoeknadYtelse: ISanitySpørsmålDokument;
    hvilketLandYtelse: ISanitySpørsmålDokument;
    planlagtBoSammenhengendeINorge: ISanitySpørsmålDokument;
    utbetaltForeldrepengerEllerEngangsstoenad: ISanitySpørsmålDokument;
    hvemErBarnSinAndreForelder: ISanitySpørsmålDokument;
    faarEllerHarFaattYtelseFraAnnetLand: ISanitySpørsmålDokument;

    /* Andre tekster */
    svaralternativSammeSomAnnenForelder: LocaleRecordBlock;
    svaralternativAnnenForelder: LocaleRecordBlock;
    barnXAvY: LocaleRecordBlock;

    /* Subtitler */
    barnetsAndreForelder: LocaleRecordString;
    bosted: LocaleRecordString;
    periodeBarnehageplass: LocaleRecordBlock;

    /* Oppfølgningstekster fra svar på Om Barna */
    opplystBarnehageplass: LocaleRecordBlock;
    opplystBarnOppholdUtenforNorge: LocaleRecordBlock;
    opplystFaarHarFaattEllerSoektYtelse: LocaleRecordBlock;
    opplystAdoptert: LocaleRecordBlock;

    /* Andre forelder */
    navnAndreForelder: ISanitySpørsmålDokument;
    foedselsnummerDnummerAndreForelder: ISanitySpørsmålDokument;
    foedselsdatoAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelder: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelderGjenlevende: ISanitySpørsmålDokument;
    medlemAvFolktetrygdenAndreForelder: ISanitySpørsmålDokument;
    borForeldreSammen: ISanitySpørsmålDokument;
    soekerDeltKontantstoette: ISanitySpørsmålDokument;
    utenlandsoppholdUtenArbeidAndreForelder: ISanitySpørsmålDokument;
    utenlandsoppholdUtenArbeidAndreForelderGjenlevende: ISanitySpørsmålDokument;
}
