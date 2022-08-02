import { useEffect, useState } from 'react';

import { Avhengigheter, useFelt } from '@navikt/familie-skjema';
import { ValiderFelt } from '@navikt/familie-skjema/dist/typer';

export const usePerioder = <T>(
    verdi: T[],
    avhengigheter?: Avhengigheter,
    skalFeltetVises?: (avhengigheter: Avhengigheter) => boolean,
    valideringsfunksjon?: ValiderFelt<T[]>
) => {
    const [perioder, settPerioder] = useState<T[]>(verdi);
    const leggTilPeriode = (periode: T) => {
        settPerioder(prevState => prevState.concat(periode));
    };

    const fjernPeriode = (periodeSomSkalFjernes: T) => {
        settPerioder(prevState => prevState.filter(periode => periode !== periodeSomSkalFjernes));
    };

    const registrertePerioder = useFelt<T[]>({
        verdi: perioder,
        avhengigheter,
        skalFeltetVises,
        valideringsfunksjon,
    });

    const [harRendretEnGang, settHarRendretEnGang] = useState<boolean>(false);

    useEffect(() => {
        if (harRendretEnGang) {
            registrertePerioder.validerOgSettFelt(perioder);
        } else {
            settHarRendretEnGang(true);
        }
    }, [perioder]);

    return {
        leggTilPeriode,
        fjernPeriode,
        registrertePerioder,
    };
};
