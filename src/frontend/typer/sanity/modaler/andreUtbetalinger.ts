import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

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
