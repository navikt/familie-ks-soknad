import { LocaleRecordBlock, LocaleRecordString } from '../../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../../typer/sanity/sanity';

export interface IEøsForBarnTekstinnhold {
    eoesForBarnTittel: LocaleRecordBlock;
    idNummerBarn: ISanitySpørsmålDokument;
    slektsforhold: ISanitySpørsmålDokument;
    velgSlektsforhold: LocaleRecordString;
    hvilkenRelasjon: ISanitySpørsmålDokument;
    borMedAndreForelder: ISanitySpørsmålDokument;
    borMedOmsorgsperson: ISanitySpørsmålDokument;
    hvorBorBarnet: ISanitySpørsmålDokument;
    oppgittIkkeBorFastSammenMedDeg: LocaleRecordString;

    /* Andre forelder */
    subtittelAndreForelder: LocaleRecordString;
    arbeidNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelder: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    utbetalingerAndreForelder: ISanitySpørsmålDokument;
    utbetalingerAndreForelderGjenlevende: ISanitySpørsmålDokument;
    idNummerAndreForelder: ISanitySpørsmålDokument;
    hvorBorAndreForelder: ISanitySpørsmålDokument;
    paagaaendeSoeknadYtelseAndreForelder: ISanitySpørsmålDokument;
    hvilketLandSoektYtelseAndreForelder: ISanitySpørsmålDokument;
    ytelseFraAnnetLandAndreForelder: ISanitySpørsmålDokument;
    ytelseFraAnnetLandAndreForelderGjenlevende: ISanitySpørsmålDokument;

    /* Omsorgsperson */
    arbeidUtenforNorgeOmsorgsperson: ISanitySpørsmålDokument;
    arbeidNorgeOmsorgsperson: ISanitySpørsmålDokument;
    pensjonNorgeOmsorgsperson: ISanitySpørsmålDokument;
    pensjonUtlandOmsorgsperson: ISanitySpørsmålDokument;
    utbetalingerOmsorgsperson: ISanitySpørsmålDokument;
    hvaHeterOmsorgspersonen: ISanitySpørsmålDokument;
    slektsforholdOmsorgsperson: ISanitySpørsmålDokument;
    hvilkenRelasjonOmsorgsperson: ISanitySpørsmålDokument;
    idNummerOmsorgsperson: ISanitySpørsmålDokument;
    hvorBorOmsorgsperson: ISanitySpørsmålDokument;
    ytelseFraAnnetLandOmsorgsperson: ISanitySpørsmålDokument;
    hvilketLandSoektYtelseOmsorgsperson: ISanitySpørsmålDokument;
    paagaaendeSoeknadYtelseOmsorgsperson: ISanitySpørsmålDokument;
}
