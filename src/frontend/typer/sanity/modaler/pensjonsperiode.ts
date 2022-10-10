import { LocaleRecordBlock } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IPensjonsperiodeTekstinnhold {
    pensjonLandNaatid: ISanitySpørsmålDokument;
    pensjonLandFortid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    leggTilFeilmelding: LocaleRecordBlock;
}
