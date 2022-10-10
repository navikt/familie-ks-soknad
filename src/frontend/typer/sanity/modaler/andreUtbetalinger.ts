import { ISanitySpørsmålDokument } from '../sanity';

export interface IAndreUtbetalingerTekstinnhold {
    utbetalingLandNaatid: ISanitySpørsmålDokument;
    utbetalingLandFortid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
}
