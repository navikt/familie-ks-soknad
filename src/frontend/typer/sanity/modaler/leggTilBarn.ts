import { ISanitySpørsmålDokument } from '../sanity';
import { LocaleRecordBlock } from '../../../../common/typer/locale';

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
