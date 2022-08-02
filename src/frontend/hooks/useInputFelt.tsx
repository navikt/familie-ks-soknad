import React, { ReactNode } from 'react';

import { guid } from 'nav-frontend-js-utils';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

const useInputFelt = ({
    søknadsfelt,
    feilmeldingSpråkId,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt: ISøknadSpørsmål<string> | null;
    feilmeldingSpråkId: string;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    feilmeldingSpråkVerdier?: { [key: string]: ReactNode };
}) =>
    useFelt<string>({
        feltId: søknadsfelt?.id ?? guid(),
        verdi: søknadsfelt ? trimWhiteSpace(søknadsfelt.svar) : '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            const feltVerdi = trimWhiteSpace(felt.verdi);
            return feltVerdi !== ''
                ? customValidering
                    ? customValidering(felt)
                    : ok(felt)
                : feil(
                      felt,
                      <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                  );
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });

export default useInputFelt;
