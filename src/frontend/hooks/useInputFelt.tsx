import { v4 as uuidv4 } from 'uuid';

import { feil, type FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { LocaleRecordBlock } from '../typer/common';
import { FlettefeltVerdier } from '../typer/kontrakt/generelle';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

interface Props {
    søknadsfelt: ISøknadSpørsmål<string> | null;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    feilmelding: LocaleRecordBlock;
    flettefelter?: FlettefeltVerdier;
}

const useInputFelt = ({
    søknadsfelt,
    feilmelding,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    flettefelter,
}: Props) => {
    const { plainTekst } = useApp();
    return useFelt<string>({
        feltId: søknadsfelt?.id ?? uuidv4(),
        verdi: søknadsfelt ? trimWhiteSpace(søknadsfelt.svar) : '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            const feltVerdi = trimWhiteSpace(felt.verdi);
            return feltVerdi !== ''
                ? customValidering
                    ? customValidering(felt)
                    : ok(felt)
                : feil(felt, plainTekst(feilmelding, flettefelter));
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });
};

export default useInputFelt;
