import { LocaleRecordBlock } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmBarnaTekstinnhold {
    omBarnaTittel: LocaleRecordBlock;
    hvemBarnehageplass: ISanitySpørsmålDokument;
    barnehageplass: ISanitySpørsmålDokument;
}
