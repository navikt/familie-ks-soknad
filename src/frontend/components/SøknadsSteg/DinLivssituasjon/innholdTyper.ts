import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { LocaleRecordBlock } from '../../../../common/typer/locale';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    dinLivssituasjonGuide: LocaleRecordBlock;
    arbeidUtenforNorge: ISanitySpørsmålDokument;
    pensjonUtland: ISanitySpørsmålDokument;
    asylsoeker: ISanitySpørsmålDokument;
    utenlandsoppholdUtenArbeid: ISanitySpørsmålDokument;
}
