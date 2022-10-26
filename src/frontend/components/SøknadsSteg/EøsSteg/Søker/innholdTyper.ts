import { LocaleRecordBlock } from '../../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../../typer/sanity/sanity';

export interface IEøsForSøkerTekstinnhold {
    eoesForSoekerTittel: LocaleRecordBlock;
    arbeidNorge: ISanitySpørsmålDokument;
    pensjonNorge: ISanitySpørsmålDokument;
    idNummer: ISanitySpørsmålDokument;
    hvorBor: ISanitySpørsmålDokument;
    utbetalinger: ISanitySpørsmålDokument;
    faarEllerHarFaattYtelseFraAnnetLand: ISanitySpørsmålDokument;
}
