import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { BeskrivelseSanityApiNavn, TittelSanityApiNavn } from '../../../typer/dokumentasjon';

export type IDokumentasjonTekstinnhold = {
    dokumentasjonTittel: LocaleRecordBlock;
    dokumentasjonGuide: LocaleRecordBlock;
    dokumentasjonGuideVedleggskrav: LocaleRecordBlock;
    dokumentasjonGuideIngenVedleggskrav: LocaleRecordBlock;
} & {
    // Info innledning
    forLangTidDokumentasjon: LocaleRecordBlock;
    vedleggskravTittel: LocaleRecordBlock;
    vedleggskrav: LocaleRecordBlock;
    ingenVedleggskravTittel: LocaleRecordBlock;
    ingenVedleggskrav: LocaleRecordBlock;
    manglerDokumentasjonSpoersmaalTittel: LocaleRecordBlock;
    manglerDokumentasjonSpoersmaal: LocaleRecordBlock;
} & {
    // Bilde scanning guide
    slikTarDuEtGodtBildeExpand: LocaleRecordString;
    slikTarDuEtGodtBildeTittel: LocaleRecordBlock;
    slikTarDuEtGodtBilde: LocaleRecordBlock;
    etterDuHarTattBildetTittel: LocaleRecordBlock;
    etterDuHarTattBildet: LocaleRecordBlock;
    vaerTryggNaarDuTarBildeTittel: LocaleRecordBlock;
    vaerTryggNaarDuTarBilde: LocaleRecordBlock;
    // Bra og dårlige eksempler
    braOgDaarligeTittel: LocaleRecordBlock;
    bra: LocaleRecordBlock;
    daarlig: LocaleRecordBlock;
    fyllerHeleBildet: LocaleRecordBlock;
    ikkeTattOvenfra: LocaleRecordBlock;
    ikkeRiktigRetning: LocaleRecordBlock;
    skyggePaaDokumentet: LocaleRecordBlock;
} & {
    // Knapper og checkbox
    sendtInnTidligere: LocaleRecordBlock;
    forMange: LocaleRecordString;
    feilFiltype: LocaleRecordString;
    forStor: LocaleRecordString;
    bildetForLite: LocaleRecordString;
    noeGikkFeil: LocaleRecordString;
    lastOppKnapp: LocaleRecordString;
    slippFilenHer: LocaleRecordString;
    slett: LocaleRecordString;
    stottedeFiltyper: LocaleRecordString;
    maksFilstorrelse: LocaleRecordString;
    maksAntallFiler: LocaleRecordString;
    lastOppFiler: LocaleRecordString;
    filtypeFeilmelding: LocaleRecordString;
    filstorrelseFeilmelding: LocaleRecordString;
    antallFilerFeilmelding: LocaleRecordString;
    ukjentFeilmelding: LocaleRecordString;
    velgFil: LocaleRecordString;
    velgFiler: LocaleRecordString;
    draOgSlippFilenHer: LocaleRecordString;
    draOgSlippFilerHer: LocaleRecordString;
    filopplastingDeaktivert: LocaleRecordString;
    filopplastingDeaktivertFilerErUnderOpplastning: LocaleRecordString;
    filopplastingDeaktivertMaksAntallFiler: LocaleRecordString;
    lastOppFilenPaNytt: LocaleRecordString;
    slettFilen: LocaleRecordString;
    lasterNed: LocaleRecordString;
    lasterOpp: LocaleRecordString;
} & {
    // Vedlegg - titler
    [TittelSanityApiNavn.avtaleOmDeltBostedTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.annenDokumentasjon]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelseFraBarnevernetTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaBarnehageplassTittel]: LocaleRecordBlock;
} & {
    // Vedlegg - beskrivelser
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonKontantstoette]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaBarnehageplass]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaBarnehageplassEttEllerFlereBarn]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.lastOppSenereISoknad]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.annenDokumentasjonBeskrivelse]: LocaleRecordBlock;
};
