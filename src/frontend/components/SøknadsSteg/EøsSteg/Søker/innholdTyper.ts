import { ISanitySpørsmålDokument } from '../../../../typer/sanity/sanity';
import { LocaleRecordBlock } from '../../../../../common/typer/locale';

export interface IEøsForSøkerTekstinnhold {
    eoesForSoekerTittel: LocaleRecordBlock;
    eosForSokerGuide: LocaleRecordBlock;
    arbeidNorge: ISanitySpørsmålDokument;
    pensjonNorge: ISanitySpørsmålDokument;
    idNummer: ISanitySpørsmålDokument;
    hvorBor: ISanitySpørsmålDokument;
    utbetalinger: ISanitySpørsmålDokument;
}
