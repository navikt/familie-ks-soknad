import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IEøsYtelseTekstinnhold {
    tittel: LocaleRecordBlock;
    oppsummeringstittelKontantstoette: LocaleRecordBlock;
    ytelseLandNaatid: ISanitySpørsmålDokument;
    ytelseLandFortid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    beloepPerMaaned: ISanitySpørsmålDokument;
    faarYtelserNaa: ISanitySpørsmålDokument;
    leggTilFeilmelding: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
}
