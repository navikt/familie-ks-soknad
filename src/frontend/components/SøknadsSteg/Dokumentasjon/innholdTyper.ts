import { LocaleRecordBlock } from '../../../typer/common';
import { BeskrivelseSanityApiNavn, TittelSanityApiNavn } from '../../../typer/dokumentasjon';

export type IDokumentasjonnTekstinnhold = {
    dokumentasjonTittel: LocaleRecordBlock;
    sendtInnTidligere: LocaleRecordBlock;
    vedleggXavY: LocaleRecordBlock;
    slippFilenHer: LocaleRecordBlock;
    lastOppKnapp: LocaleRecordBlock;
    nudgeDokumentasjon: LocaleRecordBlock;
    forLangTidDokumentasjon: LocaleRecordBlock;
    dokumentasjonInfo: LocaleRecordBlock;
} & {
    [TittelSanityApiNavn.avtaleOmDeltBostedTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.annenDokumentasjon]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelseFraBarnevernetTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaBarnehageplassTittel]: LocaleRecordBlock;
} & {
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonKontantstoette]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelseFraBarnevernet]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaBarnehageplass]: LocaleRecordBlock;
};
