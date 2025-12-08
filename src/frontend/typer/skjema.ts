import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { EBarnehageplassPeriodeBeskrivelse } from '../components/Felleskomponenter/Barnehagemodal/barnehageplassTyper';

import { barnDataKeySpørsmål } from './barn';
import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent, ISODateString } from './common';
import { Slektsforhold } from './kontrakt/generelle';
import {
    IArbeidsperiode,
    IBarnehageplassPeriode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer } from './person';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';

export interface IDinLivssituasjonFeltTyper {
    erAsylsøker: ESvar | null;
    arbeidIUtlandet: ESvar | null;
    registrerteArbeidsperioder: IArbeidsperiode[];
    mottarUtenlandspensjon: ESvar | null;
    registrertePensjonsperioder: IPensjonsperiode[];
    utenlandsoppholdUtenArbeid: ESvar | null;
    registrerteUtenlandsperioder: IUtenlandsperiode[];
}

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | null;
    oppholderBarnSegIInstitusjon: ESvar | null;
    erBarnAdoptert: ESvar | null;
    søktAsylForBarn: ESvar | null;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | null;
    mottarKontantstøtteForBarnFraAnnetEøsland: ESvar | null;
    harEllerTildeltBarnehageplass: ESvar | null;
    erAvdødPartnerForelder: ESvar | null;
    hvemErFosterbarn: BarnetsId[];
    hvemOppholderSegIInstitusjon: BarnetsId[];
    hvemErAdoptert: BarnetsId[];
    hvemKontantstøtteFraAnnetEøsland: BarnetsId[];
    hvemTolvMndSammenhengendeINorge: BarnetsId[];
    hvemErSøktAsylFor: BarnetsId[];
    hvemHarBarnehageplass: BarnetsId[];
    hvemAvdødPartner: BarnetsId[];
}

export interface IOmBarnetFeltTyper {
    utbetaltForeldrepengerEllerEngangsstønad: ESvar | null;
    planleggerÅBoINorge12Mnd: ESvar | null;
    pågåendeSøknadFraAnnetEøsLand: ESvar | null;
    pågåendeSøknadHvilketLand: Alpha3Code | '';
    mottarEllerMottokEøsKontantstøtte: ESvar | null;
    registrerteEøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    registrerteBarnehageplassPerioder: IBarnehageplassPeriode[];
    andreForelderNavn: string;
    andreForelderKanIkkeGiOpplysninger: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderYrkesaktivFemÅr: ESvar | null;
    andreForelderArbeidUtlandet: ESvar | null;
    andreForelderArbeidsperioderUtland: IArbeidsperiode[];
    andreForelderUtenlandsoppholdUtenArbeid: ESvar | null;
    andreForelderUtenlandsperioder: IUtenlandsperiode[];
    andreForelderPensjonUtland: ESvar | null;
    andreForelderPensjonsperioderUtland: IPensjonsperiode[];
    borFastMedSøker: ESvar | null;
    sammeForelderSomAnnetBarn: string | null;
    barnRegistrerteUtenlandsperioder: IUtenlandsperiode[];
    foreldreBorSammen: ESvar | null;
    søkerDeltKontantstøtte: ESvar | null;
}

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    værtINorgeITolvMåneder: ESvar | null;
    planleggerÅBoINorgeTolvMnd: ESvar | null;
    yrkesaktivFemÅr: ESvar | null;
}

export type IdNummerKey = `${string}-idnummer-${string}`;

export interface IEøsForSøkerFeltTyper {
    arbeidINorge: ESvar | null;
    registrerteArbeidsperioder: IArbeidsperiode[];
    pensjonNorge: ESvar | null;
    registrertePensjonsperioder: IPensjonsperiode[];
    andreUtbetalinger: ESvar | null;
    registrerteAndreUtbetalinger: IUtbetalingsperiode[];
    adresseISøkeperiode: string;
    [key: IdNummerKey]: IIdNummer;
}

export interface IEøsForBarnFeltTyper {
    andreForelderPensjonNorge: ESvar | null;
    andreForelderPensjonsperioderNorge: IPensjonsperiode[];
    andreForelderArbeidNorge: ESvar | null;
    andreForelderArbeidsperioderNorge: IArbeidsperiode[];
    andreForelderAndreUtbetalinger: ESvar | null;
    andreForelderAndreUtbetalingsperioder: IUtbetalingsperiode[];
    andreForelderPågåendeSøknadFraAnnetEøsLand: ESvar | null;
    andreForelderPågåendeSøknadHvilketLand: Alpha3Code | '';
    andreForelderKontantstøtteFraEøs: ESvar | null;
    andreForelderEøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    andreForelderAdresse: string | AlternativtSvarForInput.UKJENT;
    andreForelderAdresseVetIkke: ESvar;
    søkersSlektsforhold: Slektsforhold | '';
    søkersSlektsforholdSpesifisering: string;
    borMedAndreForelder: ESvar | null;
    borMedOmsorgsperson: ESvar | null;
    [key: IdNummerKey]: IIdNummer;
    omsorgspersonNavn: string;
    omsorgspersonSlektsforhold: Slektsforhold | '';
    omsorgpersonSlektsforholdSpesifisering: string;
    omsorgspersonIdNummer: string;
    omsorgspersonIdNummerVetIkke: ESvar;
    omsorgspersonAdresse: string;
    omsorgspersonAdresseVetIkke: ESvar;
    omsorgspersonArbeidUtland: ESvar | null;
    omsorgspersonArbeidsperioderUtland: IArbeidsperiode[];
    omsorgspersonArbeidNorge: ESvar | null;
    omsorgspersonArbeidsperioderNorge: IArbeidsperiode[];
    omsorgspersonPensjonUtland: ESvar | null;
    omsorgspersonPensjonsperioderUtland: IPensjonsperiode[];
    omsorgspersonPensjonNorge: ESvar | null;
    omsorgspersonPensjonsperioderNorge: IPensjonsperiode[];
    omsorgspersonAndreUtbetalinger: ESvar | null;
    omsorgspersonAndreUtbetalingsperioder: IUtbetalingsperiode[];
    omsorgspersonPågåendeSøknadFraAnnetEøsLand: ESvar | null;
    omsorgspersonPågåendeSøknadHvilketLand: Alpha3Code | '';
    omsorgspersonKontantstøtteFraEøs: ESvar | null;
    omsorgspersonEøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    barnetsAdresse: string | AlternativtSvarForInput.UKJENT;
    barnetsAdresseVetIkke: ESvar;
}

export interface IVelgBarnFeltTyper {
    barnMedISøknad: IBarn[];
}

export interface ILeggTilBarnTyper
    extends Omit<
        IBarn,
        'borMedSøker' | 'alder' | 'erUnder11Mnd' | 'navn' | 'adressebeskyttelse' | 'id' | barnDataKeySpørsmål
    > {
    fornavn: string;
    etternavn: string;
    navnetErUbestemt: ESvar;
    ident: string;
    ikkeFåttIdentChecked: ESvar;
}

export interface IUtenlandsoppholdFeltTyper {
    utenlandsoppholdÅrsak: EUtenlandsoppholdÅrsak | '';
    oppholdsland: Alpha3Code | '';
    oppholdslandFraDato: ISODateString;
    oppholdslandTilDato: ISODateString;
    oppholdslandTilDatoUkjent: ESvar;
    adresse: string;
    adresseUkjent: ESvar;
}

export interface IUtbetalingerFeltTyper {
    fårUtbetalingNå: ESvar | null;
    utbetalingLand: Alpha3Code | '';
    utbetalingFraDato: ISODateString;
    utbetalingTilDato: ISODateString;
    utbetalingTilDatoUkjent: ESvar;
}

export interface IPensjonsperiodeFeltTyper {
    mottarPensjonNå: ESvar | null;
    pensjonsland: Alpha3Code | '';
    pensjonFraDato: ISODateString;
    pensjonTilDato: ISODateString;
}

export interface IArbeidsperioderFeltTyper {
    arbeidsperiodeAvsluttet: ESvar | null;
    arbeidsperiodeLand: Alpha3Code | '';
    arbeidsgiver: string;
    fraDatoArbeidsperiode: ISODateString;
    tilDatoArbeidsperiode: ISODateString;
    tilDatoArbeidsperiodeUkjent: ESvar;
    adresse: string;
    adresseUkjent: ESvar;
}

export interface IKontantstøttePerioderFeltTyper {
    mottarEøsKontantstøtteNå: ESvar | null;
    kontantstøtteLand: Alpha3Code | '';
    fraDatoKontantstøttePeriode: ISODateString;
    tilDatoKontantstøttePeriode: ISODateString;
    månedligBeløp: string;
}

export interface IBarnehageplassPerioderFeltTyper {
    barnehageplassPeriodeBeskrivelse: EBarnehageplassPeriodeBeskrivelse | '';
    barnehageplassUtlandet: ESvar | null;
    barnehageplassLand: Alpha3Code | '';
    offentligStøtte: ESvar | null;
    harHeltidDeltidBarnehageplass:
        | AlternativtSvarForInput.BARNEHAGEPLASS_HELTID
        | AlternativtSvarForInput.BARNEHAGEPLASS_DELTID
        | null;
    antallTimer: string;
    startetIBarnehagen: ISODateString;
    slutterIBarnehagen: ISODateString;
    slutterIBarnehagenVetIkke: ESvar;
}

export type SkjemaFeltTyper =
    | IOmDegFeltTyper
    | IVelgBarnFeltTyper
    | ILeggTilBarnTyper
    | IOmBarnetFeltTyper
    | IOmBarnaDineFeltTyper
    | IDinLivssituasjonFeltTyper
    | IUtenlandsoppholdFeltTyper
    | IPensjonsperiodeFeltTyper
    | IEøsForSøkerFeltTyper
    | IEøsForBarnFeltTyper
    | IUtbetalingerFeltTyper
    | IArbeidsperioderFeltTyper
    | IKontantstøttePerioderFeltTyper
    | IBarnehageplassPerioderFeltTyper;
