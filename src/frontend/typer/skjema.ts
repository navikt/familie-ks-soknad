import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from './barn';
import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent, ESvarMedUbesvart } from './common';
import { Slektsforhold } from './kontrakt/generelle';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer } from './person';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';

export interface IDinLivssituasjonFeltTyper {
    erAsylsøker: ESvar | null;
    jobberPåBåt: ESvar | null;
    registrerteArbeidsperioder: IArbeidsperiode[];
    mottarUtenlandspensjon: ESvar | null;
    registrertePensjonsperioder: IPensjonsperiode[];
}

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | null;
    oppholderBarnSegIInstitusjon: ESvar | null;
    erBarnAdoptertFraUtland: ESvar | null;
    søktAsylForBarn: ESvar | null;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | null;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | null;
    erAvdødPartnerForelder: ESvar | null;
    hvemErFosterbarn: BarnetsId[];
    hvemOppholderSegIInstitusjon: BarnetsId[];
    hvemErAdoptertFraUtland: BarnetsId[];
    hvemBarnetrygdFraAnnetEøsland: BarnetsId[];
    hvemTolvMndSammenhengendeINorge: BarnetsId[];
    hvemErSøktAsylFor: BarnetsId[];
    hvemAvdødPartner: BarnetsId[];
}

export interface IOmBarnetUtvidetFeltTyper {
    institusjonIUtlandCheckbox: ESvar;
    institusjonsnavn: string;
    institusjonsadresse: string;
    institusjonspostnummer: string;
    institusjonOppholdStartdato: ISODateString;
    institusjonOppholdSluttdato: DatoMedUkjent;
    institusjonOppholdSluttVetIkke: ESvar;
    planleggerÅBoINorge12Mnd: ESvar | null;
    pågåendeSøknadFraAnnetEøsLand: ESvar | null;
    pågåendeSøknadHvilketLand: Alpha3Code | '';
    mottarEllerMottokEøsBarnetrygd: ESvar | null;
    registrerteEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    andreForelderNavn: string;
    andreForelderKanIkkeGiOpplysninger: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderArbeidUtlandet: ESvar | null;
    andreForelderArbeidsperioderUtland: IArbeidsperiode[];
    andreForelderPensjonUtland: ESvar | null;
    andreForelderPensjonsperioderUtland: IPensjonsperiode[];
    borFastMedSøker: ESvar | null;
    skriftligAvtaleOmDeltBosted: ESvar | null;
    sammeForelderSomAnnetBarn: string | null;
    registrerteUtenlandsperioder: IUtenlandsperiode[];
}

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    værtINorgeITolvMåneder: ESvar | null;
    planleggerÅBoINorgeTolvMnd: ESvar | null;
    registrerteUtenlandsperioder: IUtenlandsperiode[];
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
    andreForelderBarnetrygdFraEøs: ESvar | null;
    andreForelderEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
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
    omsorgspersonBarnetrygdFraEøs: ESvar | null;
    omsorgspersonEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    barnetsAdresse: string | AlternativtSvarForInput.UKJENT;
    barnetsAdresseVetIkke: ESvar;
}

export interface IVelgBarnFeltTyper {
    barnMedISøknad: IBarn[];
}

export interface ILeggTilBarnTyper
    extends Omit<
        IBarn,
        'borMedSøker' | 'alder' | 'navn' | 'adressebeskyttelse' | 'id' | barnDataKeySpørsmål
    > {
    erFødt: ESvarMedUbesvart;
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
}

export interface IBarnetrygdperioderFeltTyper {
    mottarEøsBarnetrygdNå: ESvar | null;
    barnetrygdsland: Alpha3Code | '';
    fraDatoBarnetrygdperiode: ISODateString;
    tilDatoBarnetrygdperiode: ISODateString;
    månedligBeløp: string;
}
export type SkjemaFeltTyper =
    | IOmDegFeltTyper
    | IVelgBarnFeltTyper
    | ILeggTilBarnTyper
    | IOmBarnetUtvidetFeltTyper
    | IOmBarnaDineFeltTyper
    | IDinLivssituasjonFeltTyper
    | IUtenlandsoppholdFeltTyper
    | IPensjonsperiodeFeltTyper
    | IEøsForSøkerFeltTyper
    | IEøsForBarnFeltTyper
    | IUtbetalingerFeltTyper
    | IArbeidsperioderFeltTyper
    | IBarnetrygdperioderFeltTyper;
