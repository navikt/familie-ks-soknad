import { LocaleRecordBlock } from '../../common';
import { ISpørsmålDokument } from '../sanity';

export interface IArbeidsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    arbeidsgiver: ISpørsmålDokument;
    arbeidsperiodenAvsluttet: ISpørsmålDokument;
    hvilketLandFortid: ISpørsmålDokument;
    hvilketLandNaatid: ISpørsmålDokument;
    sluttdatoArbeidsperiodeFortid: ISpørsmålDokument;
    sluttdatoArbeidsperiodeFremtid: ISpørsmålDokument;
    startdatoArbeidsperiode: ISpørsmålDokument;
    flerePerioder: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
}
