import { LocaleRecordBlock, LocaleRecordString } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IArbeidsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    arbeidsgiver: ISanitySpørsmålDokument;
    arbeidsperiodenAvsluttet: ISanitySpørsmålDokument;
    hvilketLandFortid: ISanitySpørsmålDokument;
    hvilketLandNaatid: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
    adresseFortid: ISanitySpørsmålDokument;
    adresseNaatid: ISanitySpørsmålDokument;
}
