import React, { ReactNode, useEffect } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { guid } from 'nav-frontend-js-utils';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    feilmeldingSpråkId,
    avhengigSvarCondition,
    avhengighet,
    nullstillVedAvhengighetEndring = true,
    skalFeltetVises = true,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt?: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmeldingSpråkId: string;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    nullstillVedAvhengighetEndring?: boolean;
    skalFeltetVises?: boolean;
    feilmeldingSpråkVerdier?: { [key: string]: ReactNode };
}) => {
    const skalViseFelt = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const landDropdown = useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt ? søknadsfelt.id : guid(),
        verdi: søknadsfelt?.svar ?? '',
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            if (!skalFeltetVises) {
                return false;
            }
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | null>)
                ? skalViseFelt(avhengigheter.jaNeiSpm.verdi)
                : true;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                  );
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalViseFelt(avhengighet.verdi);

        skalVises &&
            landDropdown.verdi !== '' &&
            landDropdown.validerOgSettFelt(landDropdown.verdi);

        return () => {
            !skalViseFelt(avhengighet.verdi) && landDropdown.validerOgSettFelt('');
        };
    }, [avhengighet]);

    return landDropdown;
};

export default useLanddropdownFeltMedJaNeiAvhengighet;
