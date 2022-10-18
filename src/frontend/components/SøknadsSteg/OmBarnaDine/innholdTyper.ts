import { LocaleRecordBlock } from '../../../typer/common';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmBarnaTekstinnhold {
    omBarnaTittel: LocaleRecordBlock;
    fosterbarn: ISanitySpørsmålDokument;
    hvemFosterbarn: ISanitySpørsmålDokument;
    institusjonKontantstoette: ISanitySpørsmålDokument;
    hvemInstitusjon: ISanitySpørsmålDokument;
    adoptertKontantstoette: ISanitySpørsmålDokument;
    hvemAdoptertKontantstoette: ISanitySpørsmålDokument;
    asyl: ISanitySpørsmålDokument;
    hvemAsyl: ISanitySpørsmålDokument;
    sammenhengendeOppholdINorge: ISanitySpørsmålDokument;
    hvemOppholdUtenforNorge: ISanitySpørsmålDokument;
    soektYtelseEuEoes: ISanitySpørsmålDokument;
    hvemSoektYtelse: ISanitySpørsmålDokument;
    barnehageplass: ISanitySpørsmålDokument;
    hvemBarnehageplass: ISanitySpørsmålDokument;
    folkeregistrertGjenlevende: ISanitySpørsmålDokument;
    hvemAvBarnaAvdoedPartner: ISanitySpørsmålDokument;
    folkeregistrertEnkeEnkemann: ISanitySpørsmålDokument;
    hvemAvBarnaAvdoedEktefelle: ISanitySpørsmålDokument;
}
