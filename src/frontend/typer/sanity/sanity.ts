import { LocaleRecordBlock } from '../common';

export interface SanityDokumentBase {
    _createdAt: string;
    _rev: string;
    _type: string;
    _id: string;
    api_navn: string;
    steg: ESanitySteg;
    tittel: string;
    visningsnavn: string;
    ytelse: string;
}

export type SanityDokument = SanityDokumentBase & {
    [fieldNavn: string]: unknown;
};

export enum ESanitySteg {
    FORSIDE = 'FORSIDE',
    OM_DEG = 'OM_DEG',
    DIN_LIVSSITUASJON = 'DIN_LIVSSITUASJON',
    VELG_BARN = 'VELG_BARN',
    OM_BARNA = 'OM_BARNA',
    OM_BARNET = 'OM_BARNET',
    EØS_FOR_SØKER = 'EØS_FOR_SØKER',
    EØS_FOR_BARN = 'EØS_FOR_BARN',
    OPPSUMMERING = 'OPPSUMMERING',
    DOKUMENTASJON = 'DOKUMENTASJON',
    KVITTERING = 'KVITTERING',
    FELLES = 'FELLES',
}

export type SanityDataSet = 'production' | 'test';

export const frittståendeOrdPrefix = 'FRITTSTAENDEORD';
export const modalPrefix = 'MODAL';
export const navigasjonPrefix = 'NAVIGASJON';

export enum EFlettefeltverdi {
    BARN_NAVN = 'BARN_NAVN',
    SØKER_NAVN = 'SØKER_NAVN',
    YTELSE = 'YTELSE',
    /*
    Legger inn disse kommentert ut, så kan vi ta de inn en etter en når vi støtter dem
    UTLANDET_NORGE = 'UTLANDET_NORGE',
    PERSONTYPE = 'PERSONTYPE',
    I_UTENFOR = 'I_UTENFOR',
    ANTALL = 'ANTALL',
    TOTAL_ANTALL = 'TOTAL_ANTALL',
    DATO = 'DATO',
    KLOKKESLETT = 'KLOKKESLETT',*/
}

export interface SpørsmålDokument {
    sporsmal: LocaleRecordBlock;
    feilmelding: LocaleRecordBlock;
    alert: LocaleRecordBlock;
}
