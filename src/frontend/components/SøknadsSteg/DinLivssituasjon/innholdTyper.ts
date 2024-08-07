import { LocaleRecordBlock } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    dinLivssituasjonGuide: LocaleRecordBlock;
    arbeidUtenforNorge: ISanitySpørsmålDokument;
    pensjonUtland: ISanitySpørsmålDokument;
    asylsoeker: ISanitySpørsmålDokument;
    utenlandsoppholdUtenArbeid: ISanitySpørsmålDokument;
}
