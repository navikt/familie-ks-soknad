import React, { ReactNode } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useApp } from '../context/AppContext';
import { LocaleRecordBlock } from '../typer/common';
import { FlettefeltVerdier } from '../typer/kontrakt/generelle';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

interface Props {
    søknadsfelt: ISøknadSpørsmål<string> | null;
    /** @deprecated **/
    feilmeldingSpråkId?: string;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    /** @deprecated **/
    feilmeldingSpråkVerdier?: Record<string, ReactNode>;
    feilmelding?: LocaleRecordBlock; // todo: fjerne optional når vi går over til sanity
    flettefelter?: FlettefeltVerdier;
}

const useInputFelt = ({
    søknadsfelt,
    feilmeldingSpråkId,
    feilmelding,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    feilmeldingSpråkVerdier,
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
                : feil(
                      felt,
                      feilmeldingSpråkId ? (
                          <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                      ) : (
                          plainTekst(feilmelding, flettefelter)
                      )
                  );
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });
};

export default useInputFelt;
