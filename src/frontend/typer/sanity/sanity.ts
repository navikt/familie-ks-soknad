import { IDinLivssituasjonTekstinnhold } from '../../components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import { IForsideTekstinnhold } from '../../components/SøknadsSteg/Forside/innholdTyper';
import { IOmDegTekstinnhold } from '../../components/SøknadsSteg/OmDeg/innholdTyper';
import { LocaleRecordString } from '../common';
import { RouteEnum } from '../routes';
import { IUtenlandsoppholdTekstinnhold } from './modaler/utenlandsopphold';
import { INavigasjonTekstinnhold } from './navigasjon';

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
    [ESanitySteg.OM_DEG]: IOmDegTekstinnhold;
    [ESanitySteg.DIN_LIVSSITUASJON]: IDinLivssituasjonTekstinnhold;
    modaler: IModalerInnhold;
    frittståendeOrd: IFrittståendeOrdInnhold;
    navigasjon: INavigasjonTekstinnhold;
}

export interface IModalerInnhold {
    utenlandsoppholdSoker: IUtenlandsoppholdTekstinnhold;
}

export interface IFrittståendeOrdInnhold {
    ytelse: {
        kontantstotte: LocaleRecordString;
        ordinaerBarnetrygd: LocaleRecordString;
        utvidetBarnetrygd: LocaleRecordString;
    };
}

export type SanityDataSet = 'production' | 'test';

export const frittståendeOrdPrefix = 'FRITTSTAENDE';
export const modalPrefix = 'MODAL';

export enum EFlettefeltverdi {
    YTELSE = 'YTELSE',
    SØKER_NAVN = 'SØKER_NAVN',
}
