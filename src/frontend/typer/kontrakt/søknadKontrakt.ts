import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from '../barn';
import { ISODateString, LocaleType } from '../common';

import { ISøknadKontraktDokumentasjon } from './dokumentasjon';
import {
    ERegistrertBostedType,
    ESivilstand,
    IAdresse,
    ISøknadsfelt,
    IUtenlandsperiodeIKontraktFormat,
} from './generelle';

export interface ISøknadKontrakt {
    kontraktVersjon: number;
    lestOgForståttBekreftelse: boolean;
    antallEøsSteg: number;
    søker: ISøknadKontraktSøker;
    barn: ISøknadIKontraktBarn[];
    dokumentasjon: ISøknadKontraktDokumentasjon[];
    teksterTilPdf: Record<string, Record<LocaleType, string>>;
    originalSpråk: LocaleType;
    erNoenAvBarnaFosterbarn: ISøknadsfelt<ESvar>;
    søktAsylForBarn: ISøknadsfelt<ESvar>;
    oppholderBarnSegIInstitusjon: ISøknadsfelt<ESvar>;
    barnOppholdtSegTolvMndSammenhengendeINorge: ISøknadsfelt<ESvar>;
    erBarnAdoptert: ISøknadsfelt<ESvar>;
    mottarKontantstøtteForBarnFraAnnetEøsland: ISøknadsfelt<ESvar>;
    harEllerTildeltBarnehageplass: ISøknadsfelt<ESvar>;
    erAvdødPartnerForelder: ISøknadsfelt<ESvar> | null;
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
    planleggerÅBoINorgeTolvMnd: ISøknadsfelt<ESvar>;
    yrkesaktivFemÅr: ISøknadsfelt<ESvar>;

    // Din livssituasjon
    erAsylsøker: ISøknadsfelt<ESvar>;
    arbeidIUtlandet: ISøknadsfelt<ESvar>;
    utenlandsoppholdUtenArbeid: ISøknadsfelt<ESvar>;
    mottarUtenlandspensjon: ISøknadsfelt<ESvar>;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
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
    teksterTilPdf: Record<string, Record<LocaleType, string>>;

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
    [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadsfelt<string> | null;
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: ISøknadsfelt<ESvar> | null;
    eøsKontantstøttePerioder: ISøknadsfelt<IEøsKontantstøttePeriodeIKontraktFormat>[];
    barnehageplassPerioder: ISøknadsfelt<IBarnehageplassPeriodeIKontraktFormat>[];

    // Om barnet
    [barnDataKeySpørsmål.borFastMedSøker]: ISøknadsfelt<ESvar>;
    [barnDataKeySpørsmål.foreldreBorSammen]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.søkerDeltKontantstøtte]: ISøknadsfelt<ESvar> | null;
    andreForelder: IAndreForelderIKontraktFormat | null;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];

    // EØS
    [barnDataKeySpørsmål.søkersSlektsforhold]: ISøknadsfelt<string> | null;
    [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: ISøknadsfelt<string> | null;
    [barnDataKeySpørsmål.borMedAndreForelder]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.borMedOmsorgsperson]: ISøknadsfelt<ESvar> | null;
    [barnDataKeySpørsmål.adresse]: ISøknadsfelt<string> | null;
    omsorgsperson: IOmsorgspersonIKontraktFormat | null;
    idNummer: ISøknadsfelt<IIdNummerIKontraktFormat>[];
}

export interface IOmsorgspersonIKontraktFormat {
    navn: ISøknadsfelt<string>;
    slektsforhold: ISøknadsfelt<string> | null;
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
    utenlandsoppholdUtenArbeid: ISøknadsfelt<ESvar> | null;
    arbeidsperioderUtland: ISøknadsfelt<IArbeidsperiodeIKontraktFormat>[];
    pensjonsperioderUtland: ISøknadsfelt<IPensjonsperiodeIKontraktFormat>[];
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];

    //EØS
    pensjonNorge: ISøknadsfelt<ESvar> | null;
    arbeidNorge: ISøknadsfelt<ESvar> | null;
    andreUtbetalinger: ISøknadsfelt<ESvar> | null;
    kontantstøtteFraEøs: ISøknadsfelt<ESvar> | null;
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
    arbeidsgiver: ISøknadsfelt<string>;
    fraDatoArbeidsperiode: ISøknadsfelt<ISODateString>;
    tilDatoArbeidsperiode: ISøknadsfelt<ISODateString>;
    adresse: ISøknadsfelt<string> | null;
}

export interface IIdNummerIKontraktFormat {
    land: ISøknadsfelt<string>;
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
