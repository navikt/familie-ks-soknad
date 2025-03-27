import { ReactNode, useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import {
    type Avhengigheter,
    feil,
    type Felt,
    type FeltState,
    ok,
    useFelt,
} from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';

const useBarnCheckboxFelt = (
    datafeltNavn: barnDataKeySpørsmål,
    feilmelding: ReactNode,
    avhengighet: Felt<ESvar | null>,
    avhengigJaNeiSpmSvarCondition = ESvar.JA
) => {
    const { søknad } = useAppContext();
    const barn = søknad.barnInkludertISøknaden;

    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigJaNeiSpmSvarCondition;

    const checkbox = useFelt<BarnetsId[]>({
        feltId: barn[0][datafeltNavn].id,
        verdi: søknad.barnInkludertISøknaden
            .filter(barn => barn[datafeltNavn].svar === ESvar.JA)
            .map(barn => barn.id),
        valideringsfunksjon: (felt: FeltState<BarnetsId[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, feilmelding);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter?.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | null>).verdi ===
                      avhengigJaNeiSpmSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalFeltetVises(avhengighet.verdi);

        if (skalVises && checkbox.verdi.length > 0) {
            checkbox.validerOgSettFelt(checkbox.verdi);
        }

        return () => {
            if (!skalFeltetVises(avhengighet.verdi)) {
                checkbox.validerOgSettFelt([]);
            }
        };
    }, [avhengighet]);

    return checkbox;
};

export default useBarnCheckboxFelt;
