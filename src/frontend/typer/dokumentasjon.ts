import { Dokumentasjonsbehov } from './kontrakt/dokumentasjon';

export interface IVedlegg {
    dokumentId: string;
    navn: string;
    størrelse: number;
    tidspunkt: string;
}

export interface IDokumentasjon {
    dokumentasjonsbehov: Dokumentasjonsbehov;
    gjelderForBarnId: string[];
    gjelderForSøker: boolean;
    harSendtInn: boolean;
    opplastedeVedlegg: IVedlegg[];
}

export enum EFiltyper {
    PDF = '.pdf',
    PNG = '.png',
    JPG = '.jpg',
    JPEG = '.jpeg',
}

export enum TittelSanityApiNavn {
    bekreftelsePaaAdopsjonTittel = 'bekreftelsePaaAdopsjonTittel',
    annenDokumentasjon = 'annenDokumentasjon',
    avtaleOmDeltBostedTittel = 'avtaleOmDeltBostedTittel',
    bekreftelseFraBarnevernetTittel = 'bekreftelseFraBarnevernetTittel',
    bekreftelsePaaAtBarnBorSammenMedDegTittel = 'bekreftelsePaaAtBarnBorSammenMedDegTittel',
    vedtakOmOppholdstillatelseTittel = 'vedtakOmOppholdstillatelseTittel',
    bekreftelsePaaBarnehageplassTittel = 'bekreftelsePaaBarnehageplassTittel',
}

export const dokumentasjonsbehovTilTittelSanityApiNavn = (
    dokumentasjonsbehov: Dokumentasjonsbehov
): string => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel;
        case Dokumentasjonsbehov.ANNEN_DOKUMENTASJON:
            return TittelSanityApiNavn.annenDokumentasjon;
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return TittelSanityApiNavn.avtaleOmDeltBostedTittel;
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel;
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel;
        case Dokumentasjonsbehov.BEKREFTELESE_PÅ_BARNEHAGEPLASS:
            return TittelSanityApiNavn.bekreftelsePaaBarnehageplassTittel;
    }
};

export enum BeskrivelseSanityApiNavn {
    bekreftelsePaaAdopsjonKontantstoette = 'bekreftelsePaaAdopsjonKontantstoette',
    avtaleOmDeltBosted = 'avtaleOmDeltBosted',
    bekreftelsePaaAtBarnBorSammenMedDeg = 'bekreftelsePaaAtBarnBorSammenMedDeg',
    vedtakOmOppholdstillatelse = 'vedtakOmOppholdstillatelse',
    bekreftelsePaaBarnehageplass = 'bekreftelsePaaBarnehageplass',
    bekreftelsePaaBarnehageplassEttEllerFlereBarn = 'bekreftelsePaaBarnehageplassEttEllerFlereBarn',
    lastOppSenereISoknad = 'lastOppSenereISoknad',
}

export const dokumentasjonsbehovTilBeskrivelseSanityApiNavn = (
    dokumentasjonsbehov: Dokumentasjonsbehov
): string | null => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonKontantstoette;
        case Dokumentasjonsbehov.ANNEN_DOKUMENTASJON:
            return null;
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return BeskrivelseSanityApiNavn.avtaleOmDeltBosted;
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg;
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse;
        case Dokumentasjonsbehov.BEKREFTELESE_PÅ_BARNEHAGEPLASS:
            return BeskrivelseSanityApiNavn.bekreftelsePaaBarnehageplass;
    }
};
