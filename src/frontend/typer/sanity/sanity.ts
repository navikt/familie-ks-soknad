import { IDinLivssituasjonTekstinnhold } from '../../components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import { IDokumentasjonnTekstinnhold } from '../../components/SøknadsSteg/Dokumentasjon/innholdTyper';
import { IEøsForBarnTekstinnhold } from '../../components/SøknadsSteg/EøsSteg/Barn/innholdTyper';
import { IEøsForSøkerTekstinnhold } from '../../components/SøknadsSteg/EøsSteg/Søker/innholdTyper';
import { IForsideTekstinnhold } from '../../components/SøknadsSteg/Forside/innholdTyper';
import { IKvitteringTekstinnhold } from '../../components/SøknadsSteg/Kvittering/innholdTyper';
import { IOmBarnaTekstinnhold } from '../../components/SøknadsSteg/OmBarnaDine/innholdTyper';
import { IOmBarnetTekstinnhold } from '../../components/SøknadsSteg/OmBarnet/innholdTyper';
import { IOmDegTekstinnhold } from '../../components/SøknadsSteg/OmDeg/innholdTyper';
import { IOppsummeringTekstinnhold } from '../../components/SøknadsSteg/Oppsummering/innholdTyper';
import { IVelgBarnTekstinnhold } from '../../components/SøknadsSteg/VelgBarn/innholdTyper';
import { LocaleRecordString } from '../common';
import { IAndreUtbetalingerTekstinnhold } from './modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from './modaler/arbeidsperiode';
import { IBarnehageplassTekstinnhold } from './modaler/barnehageplass';
import { IEøsKontantstøtteTekstinnhold } from './modaler/eøsKontantstøtte';
import { ILeggTilBarnTekstinnhold } from './modaler/leggTilBarn';
import { IPensjonsperiodeTekstinnhold } from './modaler/pensjonsperiode';
import { IUtenlandsoppholdTekstinnhold } from './modaler/utenlandsopphold';
import { INavigasjonTekstinnhold } from './navigasjon';

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
export interface ITekstinnhold {
    [ESanitySteg.FORSIDE]: IForsideTekstinnhold;
    [ESanitySteg.OM_DEG]: IOmDegTekstinnhold;
    [ESanitySteg.DIN_LIVSSITUASJON]: IDinLivssituasjonTekstinnhold;
    [ESanitySteg.VELG_BARN]: IVelgBarnTekstinnhold;
    [ESanitySteg.OM_BARNA]: IOmBarnaTekstinnhold;
    [ESanitySteg.OM_BARNET]: IOmBarnetTekstinnhold;
    [ESanitySteg.EØS_FOR_SØKER]: IEøsForSøkerTekstinnhold;
    [ESanitySteg.EØS_FOR_BARN]: IEøsForBarnTekstinnhold;
    [ESanitySteg.OPPSUMMERING]: IOppsummeringTekstinnhold;
    [ESanitySteg.DOKUMENTASJON]: IDokumentasjonnTekstinnhold;
    [ESanitySteg.KVITTERING]: IKvitteringTekstinnhold;
    modaler: IModalerInnhold;
    frittståendeOrd: IFrittståendeOrdInnhold;
    navigasjon: INavigasjonTekstinnhold;
}

export interface IModalerInnhold {
    andreUtbetalingerSøker: IAndreUtbetalingerTekstinnhold;
    andreUtbetalingerAndreForelder: IAndreUtbetalingerTekstinnhold;
    andreUtbetalingerOmsorgsperson: IAndreUtbetalingerTekstinnhold;
    arbeidsperioderSøker: IArbeidsperiodeTekstinnhold;
    arbeidsperioderAndreForelder: IArbeidsperiodeTekstinnhold;
    arbeidsperioderOmsorgsperson: IArbeidsperiodeTekstinnhold;
    barnehageplass: IBarnehageplassTekstinnhold;
    eøsKontantstøtteSøker: IEøsKontantstøtteTekstinnhold;
    eøsKontantstøtteAndreForelder: IEøsKontantstøtteTekstinnhold;
    eøsKontantstøtteOmsorgsperson: IEøsKontantstøtteTekstinnhold;
    leggTilBarn: ILeggTilBarnTekstinnhold;
    pensjonsperiodeSøker: IPensjonsperiodeTekstinnhold;
    pensjonsperiodeAndreForelder: IPensjonsperiodeTekstinnhold;
    pensjonsperiodeOmsorgsperson: IPensjonsperiodeTekstinnhold;
    utenlandsoppholdSoker: IUtenlandsoppholdTekstinnhold;
    utenlandsoppholdBarn: IUtenlandsoppholdTekstinnhold;
}

export interface IFrittståendeOrdInnhold {
    kontantstoette: LocaleRecordString;
    ordinaerBarnetrygd: LocaleRecordString;
    utvidetBarnetrygd: LocaleRecordString;
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
