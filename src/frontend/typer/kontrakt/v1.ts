import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { barnDataKeySpørsmål } from '../barn';
import { ISøknadKontraktDokumentasjon } from './dokumentasjon';
import {
    ERegistrertBostedType,
    ESivilstand,
    IAdresse,
    ISøknadsfelt,
    IUtenlandsperiodeIKontraktFormat,
    Slektsforhold,
    SpørsmålMap,
} from './generelle';

export interface ISøknadKontrakt {
    kontraktVersjon: number;
    antallEøsSteg: number;
    søker: ISøknadKontraktSøker;
    barn: ISøknadIKontraktBarn[];
    spørsmål: SpørsmålMap;
    dokumentasjon: ISøknadKontraktDokumentasjon[];
    teksterUtenomSpørsmål: Record<string, Record<LocaleType, string>>;
    originalSpråk: LocaleType;
}

export interface ISøknadKontraktSøker {
    harEøsSteg: boolean;

    // Om deg
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    statsborgerskap: ISøknadsfelt<string[]>;
    adresse: ISøknadsfelt<IAdresse | null>;
    adressebeskyttelse: boolean;
    sivilstand: ISøknadsfelt<ESivilstand>;
    borPåRegistrertAdresse: ISøknadsfelt<ESvar> | null;
    værtINorgeITolvMåneder: ISøknadsfelt<ESvar>;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    planleggerÅBoINorgeTolvMnd: ISøknadsfelt<ESvar> | null;
    yrkesaktivFemÅr: ISøknadsfelt<ESvar>;

    // Din livssituasjon
    erAsylsøker: ISøknadsfelt<ESvar>;
    arbeidIUtlandet: ISøknadsfelt<ESvar>;
    mottarUtenlandspensjon: ISøknadsfelt<ESvar>;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];

    // EØS
    arbeidINorge: ISøknadsfelt<ESvar> | null;
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonNorge: ISøknadsfelt<ESvar> | null;
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
    andreUtbetalinger: ISøknadsfelt<ESvar> | null;
    adresseISøkeperiode: ISøknadsfelt<string> | null;
}

export interface ISøknadIKontraktBarn {
    harEøsSteg: boolean;
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    registrertBostedType: ISøknadsfelt<ERegistrertBostedType>;
    alder: ISøknadsfelt<string> | null;

    // Om barna
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.erAdoptert]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.harBarnehageplass]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.andreForelderErDød]: ISøknadsfelt<ESvar> | null;

    // Om barnet - oppfølgningsspørsmål fra "om barna"
    [barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadsfelt<Alpha3Code> | null;
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: ISøknadsfelt<ESvar> | null;
    eøsKontantstøttePerioder: ISøknadsfelt<IEøsKontantstøttePeriodeIKontraktFormat>[];
    barnehageplassPerioder: ISøknadsfelt<IBarnehageplassPeriodeIKontraktFormat>[];

    // Om barnet
    [barnDataKeySpørsmål.borFastMedSøker]: ISøknadsfelt<ESvar>;
    andreForelder: IAndreForelderIKontraktFormat | null;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];

    // EØS
    [barnDataKeySpørsmål.søkersSlektsforhold]: ISøknadsfelt<Slektsforhold> | null;
    [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: ISøknadsfelt<string> | null;
    [barnDataKeySpørsmål.borMedAndreForelder]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.borMedOmsorgsperson]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.adresse]: ISøknadsfelt<string> | null;
    omsorgsperson: IOmsorgspersonIKontraktFormat | null;
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
}

export interface IOmsorgspersonIKontraktFormat {
    navn: ISøknadsfelt<string>;
    slektsforhold: ISøknadsfelt<string>;
    slektsforholdSpesifisering: ISøknadsfelt<string> | null;
    idNummer: ISøknadsfelt<string>;
    adresse: ISøknadsfelt<string>;
    arbeidUtland: ISøknadsfelt<ESvar>;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    arbeidNorge: ISøknadsfelt<ESvar>;
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonUtland: ISøknadsfelt<ESvar>;
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    pensjonNorge: ISøknadsfelt<ESvar>;
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    andreUtbetalinger: ISøknadsfelt<ESvar>;
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat>[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadsfelt<ESvar>;
    pågåendeSøknadHvilketLand: ISøknadsfelt<string> | null;
    kontantstøtteFraEøs: ISøknadsfelt<ESvar>;
    eøsKontantstøttePerioder: ISøknadsfelt<IEøsKontantstøttePeriodeIKontraktFormat>[];
}

export interface IAndreForelderIKontraktFormat {
    kanIkkeGiOpplysninger: ISøknadsfelt<ESvar>;
    navn: ISøknadsfelt<string> | null;
    fnr: ISøknadsfelt<string> | null;
    fødselsdato: ISøknadsfelt<string> | null;
    yrkesaktivFemÅr: ISøknadsfelt<ESvar> | null;
    pensjonUtland: ISøknadsfelt<ESvar> | null;
    arbeidUtlandet: ISøknadsfelt<ESvar> | null;
    skriftligAvtaleOmDeltBosted: ISøknadsfelt<ESvar> | null;

    //EØS
    pensjonNorge: ISøknadsfelt<ESvar> | null;
    arbeidNorge: ISøknadsfelt<ESvar> | null;
    andreUtbetalinger: ISøknadsfelt<ESvar> | null;
    kontantstøtteFraEøs: ISøknadsfelt<ESvar> | null;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    arbeidsperioderNorge: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderNorge: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadsfelt<ESvar> | null;
    pågåendeSøknadHvilketLand: ISøknadsfelt<string> | null;
    eøsKontantstøttePerioder: ISøknadsfelt<IEøsKontantstøttePeriodeIKontraktFormat>[];
    andreUtbetalingsperioder: ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat>[];
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
    adresse: ISøknadsfelt<string> | null;
}

export interface IArbeidsperiodeIKontraktFormat {
    arbeidsperiodeAvsluttet: ISøknadsfelt<string> | null;
    arbeidsperiodeland: ISøknadsfelt<string> | null;
    arbeidsgiver: ISøknadsfelt<string> | null;
    fraDatoArbeidsperiode: ISøknadsfelt<ISODateString> | null;
    tilDatoArbeidsperiode: ISøknadsfelt<ISODateString> | null;
}

export interface IIdNummerIKontraktFormat {
    land: ISøknadsfelt<Alpha3Code>;
    idNummer: ISøknadsfelt<string>;
}

export interface IPensjonsperiodeIKontraktFormat {
    mottarPensjonNå: ISøknadsfelt<ESvar> | null;
    pensjonsland: ISøknadsfelt<string> | null;
    pensjonFra: ISøknadsfelt<ISODateString> | null;
    pensjonTil: ISøknadsfelt<ISODateString> | null;
}

export interface IEøsKontantstøttePeriodeIKontraktFormat {
    mottarEøsKontantstøtteNå: ISøknadsfelt<ESvar> | null;
    kontantstøtteLand: ISøknadsfelt<string>;
    fraDatoKontantstøttePeriode: ISøknadsfelt<ISODateString>;
    tilDatoKontantstøttePeriode: ISøknadsfelt<ISODateString> | null;
    månedligBeløp: ISøknadsfelt<string>;
}

export interface IUtbetalingsperiodeIKontraktFormat {
    fårUtbetalingNå: ISøknadsfelt<ESvar> | null;
    utbetalingLand: ISøknadsfelt<string>;
    utbetalingFraDato: ISøknadsfelt<ISODateString>;
    utbetalingTilDato: ISøknadsfelt<ISODateString | string>;
}

export interface IBarnehageplassPeriodeIKontraktFormat {
    barnehageplassPeriodeBeskrivelse: ISøknadsfelt<string>;
    barnehageplassUtlandet: ISøknadsfelt<ESvar>;
    barnehageplassLand: ISøknadsfelt<string> | null;
    offentligStøtte: ISøknadsfelt<ESvar> | null;
    antallTimer: ISøknadsfelt<string>;
    startetIBarnehagen: ISøknadsfelt<ISODateString>;
    slutterIBarnehagen: ISøknadsfelt<ISODateString | string>;
}
