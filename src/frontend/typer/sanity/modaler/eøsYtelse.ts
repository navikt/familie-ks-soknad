import { LocaleRecordBlock } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IEøsYtelseTekstinnhold {
    ytelseLandNaatid: ISanitySpørsmålDokument;
    ytelseLandFortid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    leggTilFeilmelding: LocaleRecordBlock;
}
