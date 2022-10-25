import { LocaleRecordBlock } from '../../common';
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
    flerePerioder: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
}
