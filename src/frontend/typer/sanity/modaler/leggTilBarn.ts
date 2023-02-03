import { LocaleRecordBlock } from '../../common';
import { ISanitySpørsmålDokument } from '../sanity';

export interface ILeggTilBarnTekstinnhold {
    tittel: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    fornavn: ISanitySpørsmålDokument;
    etternavn: ISanitySpørsmålDokument;
    foedselsnummerEllerDNummer: ISanitySpørsmålDokument;
    barnetsNavnSubtittel: LocaleRecordBlock;
    foedselsnummerAlert: LocaleRecordBlock;
    foedselsnummerFeilmelding: LocaleRecordBlock;
    sammeFoedselsnummerFeilmelding: LocaleRecordBlock;
}
