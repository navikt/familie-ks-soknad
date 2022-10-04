import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import TekstBlock from '../components/Felleskomponenter/TekstBlock';
import { LocaleRecordBlock } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFelt = ({
    søknadsfelt,
    feilmelding,
    skalFeltetVises,
    nullstillVedAvhengighetEndring = false,
    barnetsNavn,
}: {
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmelding: LocaleRecordBlock;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
    barnetsNavn?: string;
}) => {
    return useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.skalFeltetVises;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>, avhengigheter) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      avhengigheter?.feilmelding ? (
                          <TekstBlock block={avhengigheter.feilmelding} barnetsNavn={barnetsNavn} />
                      ) : (
                          ''
                      )
                  );
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { skalFeltetVises, feilmelding },
    });
};

export default useLanddropdownFelt;
