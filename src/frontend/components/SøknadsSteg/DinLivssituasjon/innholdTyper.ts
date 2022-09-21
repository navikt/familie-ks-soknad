import { LocaleRecordBlock } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    pensjonUtland: ISanitySpørsmålDokument;
    arbeidUtenforNorge: ISanitySpørsmålDokument;
    asylsoeker: ISanitySpørsmålDokument;
}
