import { IDinLivssituasjonTekstinnhold } from '../../components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import { IDokumentasjonTekstinnhold } from '../../components/SøknadsSteg/Dokumentasjon/innholdTyper';
import { IEøsForBarnTekstinnhold } from '../../components/SøknadsSteg/EøsSteg/Barn/innholdTyper';
import { IEøsForSøkerTekstinnhold } from '../../components/SøknadsSteg/EøsSteg/Søker/innholdTyper';
import { IForsideTekstinnhold } from '../../components/SøknadsSteg/Forside/innholdTyper';
import { IKvitteringTekstinnhold } from '../../components/SøknadsSteg/Kvittering/innholdTyper';
import { IOmBarnaTekstinnhold } from '../../components/SøknadsSteg/OmBarnaDine/innholdTyper';
import { IOmBarnetTekstinnhold } from '../../components/SøknadsSteg/OmBarnet/innholdTyper';
import { IOmDegTekstinnhold } from '../../components/SøknadsSteg/OmDeg/innholdTyper';
import { IOppsummeringTekstinnhold } from '../../components/SøknadsSteg/Oppsummering/innholdTyper';
import { IVelgBarnTekstinnhold } from '../../components/SøknadsSteg/VelgBarn/innholdTyper';
import { LocaleRecordBlock, LocaleRecordString } from '../common';

import { IAndreUtbetalingerTekstinnhold } from './modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from './modaler/arbeidsperiode';
import { IBarnehageplassTekstinnhold } from './modaler/barnehageplass';
import { IBlokkerTilbakeKnappModal } from './modaler/blokkerTilbakeKnapp';
import { IEøsYtelseTekstinnhold } from './modaler/eøsYtelse';
import { ILeggTilBarnTekstinnhold } from './modaler/leggTilBarn';
import { IMistetInformasjonenDinModal } from './modaler/mistetInformasjonenDin';
import { IPensjonsperiodeTekstinnhold } from './modaler/pensjonsperiode';
import { IStartPåNyttModal } from './modaler/startPåNytt';
import { IUtenlandsoppholdTekstinnhold } from './modaler/utenlandsopphold';
import { ESanitySteg } from './sanity';

export enum SanityPersonType {
    ANDRE_FORELDER = 'ANDRE_FORELDER',
    SOKER = 'SOKER',
    OMSORGSPERSON = 'OMSORGSPERSON',
    BARN = 'BARN',
}

export enum SanityModalPrefix {
    ARBEIDSPERIODE = 'MODAL_ARBEIDSPERIODE',
    ANDRE_UTBETALINGER = 'MODAL_ANDRE_UTBETALINGER',
    PENSJONSPERIODE = 'MODAL_PENSJONSPERIODE',
    LEGG_TIL_BARN = 'MODAL_LEGG_TIL_BARN',
    EOS_YTELSE = 'MODAL_EOS_YTELSE',
    BARNEHAGEPLASS = 'MODAL_BARNEHAGEPLASS',
    UTENLANDSOPPHOLD = 'MODAL_UTENLANDSOPPHOLD',
    START_PAA_NYTT = 'MODAL_START_PAA_NYTT',
    MISTET_INFORMASJONEN_DIN = 'MODAL_MISTET_INFORMASJONEN_DIN',
    BLOKKER_TILBAKE_KNAPP = 'MODAL_BLOKKER_TILBAKE_KNAPP',
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
    [ESanitySteg.DOKUMENTASJON]: IDokumentasjonTekstinnhold;
    [ESanitySteg.KVITTERING]: IKvitteringTekstinnhold;
    [ESanitySteg.FELLES]: IFellesTekstInnhold;
}

export interface IFellesTekstInnhold {
    modaler: IModalerTekstinnhold;
    frittståendeOrd: IFrittståendeOrdTekstinnhold;
    navigasjon: INavigasjonTekstinnhold;
    formateringsfeilmeldinger: IFormateringsfeilmeldingerTekstinnhold;
    vedlikeholdsarbeid: IVedlikeholdsarbeidTekstinnhold;
    kanIkkeBrukeSoeknad: IKanIkkeBrukeSoeknadTekstinnhold;
    hjelpeteksterForInput: IHjelpeteksterForInputTekstInnhold;
    alternativeTekster: IAlternativeTeksterTekstinnhold;
    midlertidigeTekster: IMidlertidigeTeksterTekstInnhold;
}

export interface IModalerTekstinnhold {
    arbeidsperiode: {
        søker: IArbeidsperiodeTekstinnhold;
        andreForelder: IArbeidsperiodeTekstinnhold;
        omsorgsperson: IArbeidsperiodeTekstinnhold;
    };
    pensjonsperiode: {
        søker: IPensjonsperiodeTekstinnhold;
        andreForelder: IPensjonsperiodeTekstinnhold;
        omsorgsperson: IPensjonsperiodeTekstinnhold;
    };
    utenlandsopphold: {
        søker: IUtenlandsoppholdTekstinnhold;
        barn: IUtenlandsoppholdTekstinnhold;
        andreForelder: IUtenlandsoppholdTekstinnhold;
    };
    barnehageplass: IBarnehageplassTekstinnhold;
    andreUtbetalinger: {
        søker: IAndreUtbetalingerTekstinnhold;
        andreForelder: IAndreUtbetalingerTekstinnhold;
        omsorgsperson: IAndreUtbetalingerTekstinnhold;
    };
    eøsYtelse: {
        søker: IEøsYtelseTekstinnhold;
        andreForelder: IEøsYtelseTekstinnhold;
        omsorgsperson: IEøsYtelseTekstinnhold;
    };
    leggTilBarn: ILeggTilBarnTekstinnhold;
    startPåNytt: IStartPåNyttModal;
    mistetInformasjonenDin: IMistetInformasjonenDinModal;
    blokkerTilbakeKnapp: IBlokkerTilbakeKnappModal;
}

export interface IFrittståendeOrdTekstinnhold {
    kontantstoette: LocaleRecordString;
    kontantstoetten: LocaleRecordString;
    sivilstandUoppgitt: LocaleRecordString;
    sivilstandEnkeEnkemann: LocaleRecordString;
    sivilstandGift: LocaleRecordString;
    sivilstandSkiltPartner: LocaleRecordString;
    sivilstandSkilt: LocaleRecordString;
    sivilstandRegistrertPartner: LocaleRecordString;
    sivilstandUgift: LocaleRecordString;
    sivilstandGjenlevendePartner: LocaleRecordString;
    sivilstandSeparert: LocaleRecordString;
    sivilstandSeparertPartner: LocaleRecordString;
    i: LocaleRecordString;
    utenfor: LocaleRecordString;
    utlandet: LocaleRecordString;
    norge: LocaleRecordString;
    ja: LocaleRecordString;
    nei: LocaleRecordString;
    jegVetIkke: LocaleRecordString;
    av: LocaleRecordString;
    vedlegg: LocaleRecordString;
    vedleggMedFeil: LocaleRecordString;
    barn: LocaleRecordString;
    soeker: LocaleRecordString;
    skjult: LocaleRecordString;
    steg: LocaleRecordString;
    visAlleSteg: LocaleRecordString;
    skjulAlleSteg: LocaleRecordString;
    fra: LocaleRecordString;
    utenlandsopphold: LocaleRecordString;
    arbeidsperioder: LocaleRecordString;
    pensjonsperioder: LocaleRecordString;
    utbetalingsperioder: LocaleRecordString;
    kontantstoetteperioder: LocaleRecordString;
    barnehageplassperioder: LocaleRecordString;
    slipp: LocaleRecordString;
    eller: LocaleRecordString;
    og: LocaleRecordString;
}

export interface INavigasjonTekstinnhold {
    startKnapp: LocaleRecordString;
    fortsettKnapp: LocaleRecordString;
    startPaaNyttKnapp: LocaleRecordString;
    duMaaRetteOppFoelgende: LocaleRecordString;
    avbrytSoeknad: LocaleRecordString;
    tilbakeKnapp: LocaleRecordString;
    gaaVidereKnapp: LocaleRecordString;
    sendSoeknadKnapp: LocaleRecordString;
    slettSoeknadKnapp: LocaleRecordString;
    fortsettSenereKnapp: LocaleRecordString;
}

export interface IFormateringsfeilmeldingerTekstinnhold {
    datoKanIkkeVaereTilbakeITid: LocaleRecordString;
    ugyldigIDnummer: LocaleRecordString;
    ugyldigBeloep: LocaleRecordString;
    ugyldigFoedselsnummer: LocaleRecordString;
    ugyldigRelasjon: LocaleRecordString;
    forLangAdresse: LocaleRecordString;
    ugyldigDato: LocaleRecordString;
    datoKanIkkeVaereFremITid: LocaleRecordString;
    datoKanIkkeVaereDagensDatoEllerFremITid: LocaleRecordString;
    periodeAvsluttesForTidlig: LocaleRecordString;
    datoKanIkkeVaere12MndTilbake: LocaleRecordString;
    ugyldigManed: LocaleRecordString;
    datoErForForsteGyldigeTidspunkt: LocaleRecordString;
    datoErEtterSisteGyldigeTidspunkt: LocaleRecordString;
    datoKanIkkeVareIFortid: LocaleRecordString;
    datoKanIkkeVareIFremtid: LocaleRecordString;
}

export interface IVedlikeholdsarbeidTekstinnhold {
    vedlikeholdTittel: LocaleRecordBlock;
    vedlikeholdBroedtekst: LocaleRecordBlock;
    vedlikeholdVeileder: LocaleRecordBlock;
}

export interface IKanIkkeBrukeSoeknadTekstinnhold {
    brukPDFKontantstoette: LocaleRecordBlock;
}

export interface IHjelpeteksterForInputTekstInnhold {
    datoformatHjelpetekst: LocaleRecordBlock;
    datoformatPlaceholder: LocaleRecordBlock;
    velgLandPlaceholder: LocaleRecordBlock;
    manedformatPlaceholder: LocaleRecordBlock;
}

export interface IAlternativeTeksterTekstinnhold {
    barneillustrajonAltTekst: LocaleRecordBlock;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMidlertidigeTeksterTekstInnhold {}
