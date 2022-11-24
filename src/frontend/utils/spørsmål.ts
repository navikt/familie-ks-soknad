import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { AlternativtSvarForInput } from '../typer/common';
import { IFrittståendeOrdTekstinnhold } from '../typer/sanity/tekstInnhold';

export const svarForSpørsmålMedUkjent = (
    vetIkkeFelt: Felt<ESvar>,
    spørsmålFelt: Felt<string>
): string => {
    if (!spørsmålFelt.erSynlig) {
        return '';
    } else {
        return vetIkkeFelt.verdi === ESvar.JA ? AlternativtSvarForInput.UKJENT : spørsmålFelt.verdi;
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
