import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IBarnehageplassTekstinnhold {
    antallTimer: ISanitySpørsmålDokument;
    fjernKnapp: LocaleRecordBlock;
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
    valgalternativBarnehageplassIFremtid: LocaleRecordString;
    valgalternativBarnehageplassNaa: LocaleRecordString;
    valgalternativBarnehageplassTidligere: LocaleRecordString;
    valgalternativPlaceholder: LocaleRecordString;
}
