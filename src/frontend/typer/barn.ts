import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent } from './common';
import { Slektsforhold } from './kontrakt/generelle';
import { IOmsorgsperson } from './omsorgsperson';
import {
    IArbeidsperiode,
    IBarnehageplassPeriode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer } from './person';
import { ISøknadSpørsmål } from './spørsmål';

export enum andreForelderDataKeySpørsmål {
    kanIkkeGiOpplysninger = 'kanIkkeGiOpplysninger',
    navn = 'navn',
    fnr = 'fnr',
    fødselsdato = 'fødselsdato',
    arbeidUtlandet = 'arbeidUtlandet',
    pensjonUtland = 'pensjonUtland',
    skriftligAvtaleOmDeltBosted = 'skriftligAvtaleOmDeltBosted',
    adresse = 'adresse',

    // EØS
    pensjonNorge = 'pensjonNorge',
    arbeidNorge = 'arbeidNorge',
    andreUtbetalinger = 'andreUtbetalinger',
    kontantstøtteFraEøs = 'kontantstøtteFraEøs',
    pågåendeSøknadFraAnnetEøsLand = 'pågåendeSøknadFraAnnetEøsLand',
    pågåendeSøknadHvilketLand = 'pågåendeSøknadHvilketLand',
}

export enum barnDataKeySpørsmål {
    erFosterbarn = 'erFosterbarn',
    erAdoptertFraUtland = 'erAdoptertFraUtland',
    erAsylsøker = 'erAsylsøker',
    kontantstøtteFraAnnetEøsland = 'kontantstøtteFraAnnetEøsland',
    pågåendeSøknadFraAnnetEøsLand = 'pågåendeSøknadFraAnnetEøsLand',
    pågåendeSøknadHvilketLand = 'pågåendeSøknadHvilketLand',
    mottarEllerMottokEøsKontantstøtte = 'mottarEllerMottokEøsKontantstøtte',
    harBarnehageplass = 'harBarnehageplass',
    andreForelderErDød = 'andreForelderErDød',
    oppholderSegIInstitusjon = 'oppholderSegIInstitusjon',
    institusjonIUtland = 'institusjonIUtland',
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjonOppholdStartdato',
    institusjonOppholdSluttdato = 'institusjonOppholdSluttdato',
    utbetaltForeldrepengerEllerEngangsstønad = 'utbetaltForeldrepengerEllerEngangsstønad',
    boddMindreEnn12MndINorge = 'boddMindreEnn12MndINorge',
    planleggerÅBoINorge12Mnd = 'planleggerÅBoINorge12Mnd',
    borFastMedSøker = 'borFastMedSøker',
    sammeForelderSomAnnetBarnMedId = 'sammeForelderSomAnnetBarnMedId',
    søkersSlektsforhold = 'søkersSlektsforhold',
    søkersSlektsforholdSpesifisering = 'søkersSlektsforholdSpesifisering',
    borMedAndreForelder = 'borMedAndreForelder',
    borMedOmsorgsperson = 'borMedOmsorgsperson',
    adresse = 'adresse',
}

export interface IAndreForelder {
    arbeidsperioderUtland: IArbeidsperiode[];
    pensjonsperioderUtland: IPensjonsperiode[];
    kanIkkeGiOpplysninger: ISøknadSpørsmål<ESvar>;
    [andreForelderDataKeySpørsmål.navn]: ISøknadSpørsmål<string | ''>;
    [andreForelderDataKeySpørsmål.fnr]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fødselsdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [andreForelderDataKeySpørsmål.arbeidUtlandet]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pensjonUtland]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: ISøknadSpørsmål<ESvar | null>;

    //EØS
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    eøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    idNummer: IIdNummer[];
    [andreForelderDataKeySpørsmål.adresse]: ISøknadSpørsmål<
        string | AlternativtSvarForInput.UKJENT
    >;
    [andreForelderDataKeySpørsmål.pensjonNorge]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.arbeidNorge]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.andreUtbetalinger]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.kontantstøtteFraEøs]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
}

export interface IBarnMedISøknad extends IBarn {
    barnErFyltUt: boolean;
    utenlandsperioder: IUtenlandsperiode[];
    eøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    barnehageplassPerioder: IBarnehageplassPeriode[];
    idNummer: IIdNummer[];
    andreForelder: IAndreForelder | null;
    omsorgsperson: IOmsorgsperson | null;
    triggetEøs: boolean;
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAdoptertFraUtland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.harBarnehageplass]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.andreForelderErDød]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.institusjonIUtland]: ISøknadSpørsmål<ESvar>;
    [barnDataKeySpørsmål.institusjonsnavn]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonsadresse]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonspostnummer]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.borFastMedSøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: ISøknadSpørsmål<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >;
    [barnDataKeySpørsmål.søkersSlektsforhold]: ISøknadSpørsmål<Slektsforhold | ''>;
    [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.borMedAndreForelder]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.borMedOmsorgsperson]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.adresse]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
}

export const muligeSlektsforhold: Slektsforhold[] = [
    Slektsforhold.FORELDER,
    Slektsforhold.ONKEL_ELLER_TANTE,
    Slektsforhold.BESTEFORELDER,
    Slektsforhold.ANNEN_FAMILIERELASJON,
    Slektsforhold.ANNEN_RELASJON,
];
