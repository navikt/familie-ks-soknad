import React, { ReactNode, useEffect } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import TekstBlock from '../components/Felleskomponenter/TekstBlock';
import { LocaleRecordBlock } from '../typer/common';
import { FlettefeltVerdier } from '../typer/kontrakt/generelle';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    feilmeldingSpråkId,
    feilmelding,
    avhengigSvarCondition,
    avhengighet,
    nullstillVedAvhengighetEndring = true,
    skalFeltetVises = true,
    feilmeldingSpråkVerdier,
    flettefelter,
}: {
    søknadsfelt?: ISøknadSpørsmål<Alpha3Code | ''>;
    /** @deprecated **/
    feilmeldingSpråkId?: string;
    feilmelding?: LocaleRecordBlock; // todo: fjerne optional når vi er ferdig med sanity
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    nullstillVedAvhengighetEndring?: boolean;
    skalFeltetVises?: boolean;
    /** @deprecated **/
    feilmeldingSpråkVerdier?: Record<string, ReactNode>;
    flettefelter?: FlettefeltVerdier;
}) => {
    const skalViseFelt = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const landDropdown = useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt ? søknadsfelt.id : uuidv4(),
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
                      feilmelding ? (
                          <TekstBlock block={feilmelding} flettefelter={flettefelter} />
                      ) : (
                          <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                      )
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
