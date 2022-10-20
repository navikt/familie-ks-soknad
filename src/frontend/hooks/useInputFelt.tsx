import React, { ReactNode } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useApp } from '../context/AppContext';
import { LocaleRecordBlock } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

const useInputFelt = ({
    søknadsfelt,
    /** @deprecated **/
    feilmeldingSpråkId,
    feilmelding,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt: ISøknadSpørsmål<string> | null;
    feilmeldingSpråkId?: string;
    feilmelding?: LocaleRecordBlock; // todo: fjerne optional når vi går over til sanity
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    feilmeldingSpråkVerdier?: Record<string, ReactNode>;
}) => {
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
                          plainTekst(feilmelding)
                      )
                  );
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });
};

export default useInputFelt;
