import { AlternativtSvarForInput, LocaleType } from '../typer/common';

import { formaterDato, formaterDatostringKunMåned } from './dato';

export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};

export const uppercaseKunFørsteBokstav = text => {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
};

export const formaterMånedMedUkjent = (
    svar: string,
    vetIkkeTekst,
    toggle: boolean,
    valgtLocale: LocaleType
) => {
    if (svar === AlternativtSvarForInput.UKJENT) {
        return vetIkkeTekst;
    } else if (toggle) {
        return uppercaseFørsteBokstav(formaterDatostringKunMåned(svar, valgtLocale));
    } else {
        return formaterDato(svar);
    }
};

export const uppercaseFørsteBokstav = text => {
    if (typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};
