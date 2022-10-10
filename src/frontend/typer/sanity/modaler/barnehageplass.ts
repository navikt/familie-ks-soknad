import { ISanitySpørsmålDokument } from '../sanity';

export interface IBarnehageplassTekstinnhold {
    barnehageHvilketLand: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    startdatoFremtid: ISanitySpørsmålDokument;
    startdatoFortid: ISanitySpørsmålDokument;
}
