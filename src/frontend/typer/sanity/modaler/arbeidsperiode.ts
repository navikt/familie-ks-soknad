import { LocaleRecordBlock } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IArbeidsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    arbeidsgiver: ISanitySpørsmålDokument;
    arbeidsperiodenAvsluttet: ISanitySpørsmålDokument;
    hvilketLandFortid: ISanitySpørsmålDokument;
    hvilketLandNaatid: ISanitySpørsmålDokument;
    sluttdatoArbeidsperiodeFortid: ISanitySpørsmålDokument;
    sluttdatoArbeidsperiodeFremtid: ISanitySpørsmålDokument;
    startdatoArbeidsperiode: ISanitySpørsmålDokument;
    flerePerioder: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
}
