import type { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/locale';
import type { ISanitySpørsmålDokument } from '../sanity';

export interface IAndreUtbetalingerTekstinnhold {
    tittel: LocaleRecordBlock;
    utbetalingLandNaatid: ISanitySpørsmålDokument;
    utbetalingLandFortid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    faarUtbetalingerNaa: ISanitySpørsmålDokument;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
}
