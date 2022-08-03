import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { dinLivssituasjonSpørsmålSpråkId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { eøsBarnSpørsmålSpråkId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { eøsSøkerSpørsmålSpråkId } from '../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { omBarnaDineSpørsmålSpråkId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { omBarnetSpørsmålSpråkId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { omDegSpørsmålSpråkId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { velgBarnSpørsmålSpråkId } from '../components/SøknadsSteg/VelgBarn/spørsmål';
import { AlternativtSvarForInput } from '../typer/common';

export const språkIndexListe = [
    omDegSpørsmålSpråkId,
    velgBarnSpørsmålSpråkId,
    omBarnaDineSpørsmålSpråkId,
    omBarnetSpørsmålSpråkId,
    dinLivssituasjonSpørsmålSpråkId,
    eøsSøkerSpørsmålSpråkId,
    eøsBarnSpørsmålSpråkId,
];
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
