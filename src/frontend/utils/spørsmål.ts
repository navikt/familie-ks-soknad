import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { AlternativtSvarForInput } from '../typer/common';

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

export const jaNeiSvarTilSpråkId = (svar: ESvar) =>
    svar === ESvar.VET_IKKE
        ? 'felles.svaralternativ.vetikke'
        : 'felles.svaralternativ.' + svar.toLowerCase();
