import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IBarnehageplassTekstinnhold {
    antallTimer: ISanitySpørsmålDokument;
    barnehageplassDeltidAntallTimer: ISanitySpørsmålDokument;
    fjernKnapp: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    hvilketLand: ISanitySpørsmålDokument;
    leggTilFeilmelding: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    offentligStoette: ISanitySpørsmålDokument;
    periodebeskrivelse: ISanitySpørsmålDokument;
    tittel: LocaleRecordBlock;
    sluttdatoFortid: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    startdatoFortid: ISanitySpørsmålDokument;
    startdatoFremtid: ISanitySpørsmålDokument;
    ugyldigTimer: LocaleRecordBlock;
    utland: ISanitySpørsmålDokument;
    harHeltidDeltidBarnehageplass: ISanitySpørsmålDokument;
    valgalternativBarnehageplassIFremtid: LocaleRecordString;
    valgalternativBarnehageplassNaa: LocaleRecordString;
    valgalternativBarnehageplassTidligere: LocaleRecordString;
    valgalternativPlaceholder: LocaleRecordString;
    oppsummeringstittel: LocaleRecordBlock;
    barnehageplassHeltid: LocaleRecordBlock;
    barnehageplassDeltid: LocaleRecordBlock;
}
