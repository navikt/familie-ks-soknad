import { IForsideTekstinnhold } from '../components/SøknadsSteg/Forside/innholdTyper';
import { RouteEnum } from './routes';

export interface SanityDokumentBase {
    _createdAt: string;
    _rev: string;
    _type: string;
    _id: string;
    api_navn: string;
    steg: RouteEnum;
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
}
export interface ITekstinnhold {
    [ESanitySteg.FORSIDE]: IForsideTekstinnhold;
}

export type SanityDataSet = 'production' | 'test';

export enum EFlettefelt {
    BARNETS_NAVN = 'BARNETS_NAVN',
    YTELSE = 'YTELSE',
}
