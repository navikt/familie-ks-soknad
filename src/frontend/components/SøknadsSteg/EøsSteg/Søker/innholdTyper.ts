import type { LocaleRecordBlock } from '../../../../../common/typer/locale';
import type { ISanitySpørsmålDokument } from '../../../../typer/sanity/sanity';

export interface IEøsForSøkerTekstinnhold {
    eoesForSoekerTittel: LocaleRecordBlock;
    eosForSokerGuide: LocaleRecordBlock;
    arbeidNorge: ISanitySpørsmålDokument;
    pensjonNorge: ISanitySpørsmålDokument;
    idNummer: ISanitySpørsmålDokument;
    hvorBor: ISanitySpørsmålDokument;
    utbetalinger: ISanitySpørsmålDokument;
}
