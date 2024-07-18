import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { BeskrivelseSanityApiNavn, TittelSanityApiNavn } from '../../../typer/dokumentasjon';

export type IDokumentasjonTekstinnhold = {
    dokumentasjonTittel: LocaleRecordBlock;
    sendtInnTidligere: LocaleRecordBlock;
    vedleggXavY: LocaleRecordBlock;
    slippFilenHer: LocaleRecordBlock;
    lastOppKnapp: LocaleRecordBlock;
    nudgeDokumentasjon: LocaleRecordBlock;
    forLangTidDokumentasjon: LocaleRecordBlock;
    dokumentasjonInfo: LocaleRecordBlock;
    slikTarDuEtGodtBilde: LocaleRecordBlock;
    etterDuHarTattBildet: LocaleRecordBlock;
    braOgDaarligeTittel: LocaleRecordBlock;
    merHjelpLenke: LocaleRecordBlock;
    bra: LocaleRecordBlock;
    daarlig: LocaleRecordBlock;
    ikkeTattOvenfra: LocaleRecordBlock;
    ikkeRiktigRetning: LocaleRecordBlock;
    fyllerHeleBildet: LocaleRecordBlock;
    skyggePaaDokumentet: LocaleRecordBlock;
    slikTarDuEtGodtBildeExpand: LocaleRecordString;
    feilFiltype: LocaleRecordString;
    fil: LocaleRecordString;
    bildetForLite: LocaleRecordString;
    forStor: LocaleRecordString;
    sendSoeknad: LocaleRecordString;
    noeGikkFeil: LocaleRecordString;
    slett: LocaleRecordString;
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
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaBarnehageplass]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaBarnehageplassEttEllerFlereBarn]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.lastOppSenereISoknad]: LocaleRecordBlock;
};
