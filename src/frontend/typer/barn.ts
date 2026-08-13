import type { ESvar } from '@navikt/familie-form-elements';
import type { Alpha3Code } from 'i18n-iso-countries';

import { Slektsforhold } from '../../common/typer/kontrakt/generelle';
import { barnDataKeySpørsmål } from '../../common/typer/kontrakt/søknadKontrakt';

import type { AlternativtSvarForInput, BarnetsId, DatoMedUkjent } from './common';
import type { IOmsorgsperson } from './omsorgsperson';
import type {
    IArbeidsperiode,
    IBarnehageplassPeriode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import type { IBarn, IIdNummer } from './person';
import type { ISøknadSpørsmål } from './spørsmål';

export enum andreForelderDataKeySpørsmål {
    kanIkkeGiOpplysninger = 'kanIkkeGiOpplysninger',
    navn = 'navn',
    fnr = 'fnr',
    yrkesaktivFemÅr = 'yrkesaktivFemÅr',
    fødselsdato = 'fødselsdato',
    arbeidUtlandet = 'arbeidUtlandet',
    utenlandsoppholdUtenArbeid = 'utenlandsoppholdUtenArbeid',
    pensjonUtland = 'pensjonUtland',
    adresse = 'adresse',

    // EØS
    pensjonNorge = 'pensjonNorge',
    arbeidNorge = 'arbeidNorge',
    andreUtbetalinger = 'andreUtbetalinger',
    kontantstøtteFraEøs = 'kontantstøtteFraEøs',
    pågåendeSøknadFraAnnetEøsLand = 'pågåendeSøknadFraAnnetEøsLand',
    pågåendeSøknadHvilketLand = 'pågåendeSøknadHvilketLand',
}

export interface IAndreForelder {
    arbeidsperioderUtland: IArbeidsperiode[];
    utenlandsperioder: IUtenlandsperiode[];
    pensjonsperioderUtland: IPensjonsperiode[];
    kanIkkeGiOpplysninger: ISøknadSpørsmål<ESvar>;
    [andreForelderDataKeySpørsmål.navn]: ISøknadSpørsmål<string | ''>;
    [andreForelderDataKeySpørsmål.fnr]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fødselsdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [andreForelderDataKeySpørsmål.yrkesaktivFemÅr]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.arbeidUtlandet]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.utenlandsoppholdUtenArbeid]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pensjonUtland]: ISøknadSpørsmål<ESvar | null>;

    //EØS
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    eøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
    idNummer: IIdNummer[];
    [andreForelderDataKeySpørsmål.adresse]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
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
    [barnDataKeySpørsmål.erAdoptert]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.harBarnehageplass]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.andreForelderErDød]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadSpørsmål<ESvar | null>;
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
    [barnDataKeySpørsmål.foreldreBorSammen]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.søkerDeltKontantstøtte]: ISøknadSpørsmål<ESvar | null>;
}

export const muligeSlektsforhold: Slektsforhold[] = [
    Slektsforhold.FORELDER,
    Slektsforhold.ONKEL_ELLER_TANTE,
    Slektsforhold.BESTEFORELDER,
    Slektsforhold.ANNEN_FAMILIERELASJON,
    Slektsforhold.ANNEN_RELASJON,
];
