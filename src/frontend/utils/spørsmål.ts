import { ESvar } from '@navikt/familie-form-elements';
import type { Felt } from '@navikt/familie-skjema';

import { AlternativtSvarForInput } from '../typer/common';
import { IFrittståendeOrdTekstinnhold } from '../typer/sanity/tekstInnhold';

import { trimWhiteSpace } from './hjelpefunksjoner';

export const svarForSpørsmålMedUkjent = (
    vetIkkeFelt: Felt<ESvar>,
    spørsmålFelt: Felt<string>
): string => {
    if (!spørsmålFelt.erSynlig) {
        return '';
    } else {
        return vetIkkeFelt.verdi === ESvar.JA
            ? AlternativtSvarForInput.UKJENT
            : trimWhiteSpace(spørsmålFelt.verdi);
    }
};

export const jaNeiSvarTilSpråkId = (svar: ESvar, tekster: IFrittståendeOrdTekstinnhold) => {
    switch (svar) {
        case ESvar.JA:
            return tekster.ja;
        case ESvar.NEI:
            return tekster.nei;
        case ESvar.VET_IKKE:
            return tekster.jegVetIkke;
    }
};
