import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';

import { ISøknadKontraktDokumentasjon } from '../typer/kontrakt/dokumentasjon';
import {
    IAndreForelderIKontraktFormat,
    IOmsorgspersonIKontraktFormat,
    ISøknadIKontraktBarn,
    ISøknadKontraktSøker,
    ISøknadKontrakt,
} from '../typer/kontrakt/v1';

export const erGyldigISøknadKontraktSøker = (input): input is ISøknadKontraktSøker =>
    'harEøsSteg' in input &&
    'ident' in input &&
    'navn' in input &&
    'statsborgerskap' in input &&
    'adresse' in input &&
    'adressebeskyttelse' in input &&
    'sivilstand' in input &&
    'spørsmål' in input &&
    'utenlandsperioder' in input &&
    'arbeidsperioderUtland' in input &&
    'pensjonsperioderUtland' in input &&
    'arbeidsperioderNorge' in input &&
    'pensjonsperioderNorge' in input &&
    'andreUtbetalingsperioder' in input &&
    'idNummer' in input;

export const erGyldigISøknadKontraktOmsorgsperson = (
    input
): input is IOmsorgspersonIKontraktFormat =>
    input === null ||
    (input &&
        'navn' in input &&
        'slektsforhold' in input &&
        'slektsforholdSpesifisering' in input &&
        'idNummer' in input &&
        'adresse' in input &&
        'arbeidUtland' in input &&
        'arbeidsperioderUtland' in input &&
        'arbeidNorge' in input &&
        'arbeidsperioderNorge' in input &&
        'pensjonUtland' in input &&
        'pensjonsperioderUtland' in input &&
        'pensjonNorge' in input &&
        'pensjonsperioderNorge' in input &&
        'andreUtbetalinger' in input &&
        'andreUtbetalingsperioder' in input &&
        'pågåendeSøknadFraAnnetEøsLand' in input &&
        'pågåendeSøknadHvilketLand' in input &&
        'kontantstøtteFraEøs' in input &&
        'eøsKontantstøttePerioder' in input);

export const erGyldigISøknadKontraktAndreForelder = (
    input
): input is IAndreForelderIKontraktFormat =>
    input === null ||
    (input &&
        'kanIkkeGiOpplysninger' in input &&
        'navn' in input &&
        'fnr' in input &&
        'fødselsdato' in input &&
        'pensjonUtland' in input &&
        'arbeidUtlandet' in input &&
        'pensjonNorge' in input &&
        'arbeidNorge' in input &&
        'andreUtbetalinger' in input &&
        'kontantstøtteFraEøs' in input &&
        'arbeidsperioderUtland' in input &&
        'pensjonsperioderUtland' in input &&
        'arbeidsperioderNorge' in input &&
        'pensjonsperioderNorge' in input &&
        'pågåendeSøknadFraAnnetEøsLand' in input &&
        'pågåendeSøknadHvilketLand' in input &&
        'eøsKontantstøttePerioder' in input &&
        'andreUtbetalingsperioder' in input &&
        'idNummer' in input);

export const erGyldigISøknadsKontraktBarn = (input): input is ISøknadIKontraktBarn =>
    input &&
    'harEøsSteg' in input &&
    'ident' in input &&
    'navn' in input &&
    'registrertBostedType' in input &&
    'alder' in input &&
    'utenlandsperioder' in input &&
    'eøsKontantstøttePerioder' in input &&
    'idNummer' in input &&
    'spørsmål' in input &&
    'omsorgsperson' in input &&
    'andreForelder' in input &&
    erGyldigISøknadKontraktOmsorgsperson(input.omsorgsperson) &&
    erGyldigISøknadKontraktAndreForelder(input.andreForelder);

export const erGyldigISøknadKontraktBarnListe = (input): input is ISøknadIKontraktBarn[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadsKontraktBarn).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontraktDokumentasjon = (
    input
): input is ISøknadKontraktDokumentasjon =>
    input.dokumentasjonsbehov && input.harSendtInn !== undefined && input.opplastedeVedlegg;

export const erGyldigDokumentasjon = (input): input is ISøknadKontraktDokumentasjon[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadKontraktDokumentasjon).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontrakt = (input): input is ISøknadKontrakt => {
    return !!(
        input &&
        'kontraktVersjon' in input &&
        'antallEøsSteg' in input &&
        'teksterUtenomSpørsmål' in input &&
        'spørsmål' in input &&
        'originalSpråk' in input &&
        erGyldigISøknadKontraktBarnListe(input.barn) &&
        erGyldigISøknadKontraktSøker(input.søker) &&
        erGyldigDokumentasjon(input.dokumentasjon)
    );
};

export const isAlpha3Code = (code: string): code is Alpha3Code => {
    return code in getAlpha3Codes();
};
