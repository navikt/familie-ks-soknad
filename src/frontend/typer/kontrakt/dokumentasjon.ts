import { LocaleType } from '@navikt/familie-sprakvelger';

export enum Dokumentasjonsbehov {
    AVTALE_DELT_BOSTED = 'AVTALE_DELT_BOSTED',
    VEDTAK_OPPHOLDSTILLATELSE = 'VEDTAK_OPPHOLDSTILLATELSE',
    ADOPSJON_DATO = 'ADOPSJON_DATO',
    BOR_FAST_MED_SØKER = 'BOR_FAST_MED_SØKER',
    BEKREFTELESE_PÅ_BARNEHAGEPLASS = 'BEKREFTELESE_PÅ_BARNEHAGEPLASS',
    ANNEN_DOKUMENTASJON = 'ANNEN_DOKUMENTASJON',
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
