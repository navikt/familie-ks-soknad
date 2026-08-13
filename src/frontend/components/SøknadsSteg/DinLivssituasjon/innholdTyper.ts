import type { LocaleRecordBlock } from '../../../../common/typer/locale';
import type { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    dinLivssituasjonGuide: LocaleRecordBlock;
    arbeidUtenforNorge: ISanitySpørsmålDokument;
    pensjonUtland: ISanitySpørsmålDokument;
    asylsoeker: ISanitySpørsmålDokument;
    utenlandsoppholdUtenArbeid: ISanitySpørsmålDokument;
}
