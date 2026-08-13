import type { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/locale';
import type { ISanitySpørsmålDokument } from '../sanity';

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
