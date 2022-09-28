import { LocaleType } from '@navikt/familie-sprakvelger';

export enum Dokumentasjonsbehov {
    AVTALE_DELT_BOSTED = 'AVTALE_DELT_BOSTED',
    VEDTAK_OPPHOLDSTILLATELSE = 'VEDTAK_OPPHOLDSTILLATELSE',
    ADOPSJON_DATO = 'ADOPSJON_DATO',
    BEKREFTELSE_FRA_BARNEVERN = 'BEKREFTELSE_FRA_BARNEVERN',
    BOR_FAST_MED_SØKER = 'BOR_FAST_MED_SØKER',
    ANNEN_DOKUMENTASJON = 'ANNEN_DOKUMENTASJON',
    BEKREFTELESE_PÅ_BARNEHAGEPLASS = 'BEKREFTELESE_PÅ_BARNEHAGEPLASS',
}

export interface ISøknadKontraktVedlegg {
    dokumentId: string;
    navn: string;
    tittel: Dokumentasjonsbehov;
}

export interface ISøknadKontraktDokumentasjon {
    dokumentasjonsbehov: Dokumentasjonsbehov;
    harSendtInn: boolean;
    opplastedeVedlegg: ISøknadKontraktVedlegg[];
    dokumentasjonSpråkTittel: Record<LocaleType, string>;
}
