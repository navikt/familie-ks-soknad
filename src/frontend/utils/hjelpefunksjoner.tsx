import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../typer/skjema';

export const randomIntFraIntervall = (min, max) => {
    // min and max inkludert
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const trimWhiteSpace = (str: string) => {
    return str.split(/\s+/).join(' ').trim();
};

export const visFeiloppsummering = (skjema: ISkjema<SkjemaFeltTyper, string>): boolean => {
    const feil = Object.values(skjema.felter).find(
        felt => felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL
    );
    return skjema.visFeilmeldinger && !!feil;
};
