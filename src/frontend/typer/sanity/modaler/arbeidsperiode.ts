import { ISanitySpørsmålDokument } from '../sanity';
import { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/locale';

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
