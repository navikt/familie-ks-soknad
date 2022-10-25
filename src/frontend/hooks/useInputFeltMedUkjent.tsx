import React, { ReactNode, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useApp } from '../context/AppContext';
import { DatoMedUkjent, LocaleRecordBlock } from '../typer/common';
import { FlettefeltVerdier } from '../typer/kontrakt/generelle';
import { IdNummerKey } from '../typer/skjema';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent } from '../utils/input';

const useInputFeltMedUkjent = ({
    søknadsfelt,
    avhengighet,
    feilmeldingSpråkId,
    feilmelding,
    erFnrInput = false,
    skalVises = true,
    customValidering = undefined,
    språkVerdier = {},
    nullstillVedAvhengighetEndring = true,
    flettefelter,
}: {
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent> | { id: IdNummerKey; svar: string } | null;
    avhengighet: Felt<ESvar>;
    /** @deprecated **/
    feilmeldingSpråkId?: string; //todo: fjerne denne når vi går over til Sanity
    feilmelding?: LocaleRecordBlock;
    erFnrInput?: boolean;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    /** @deprecated **/
    språkVerdier?: Record<string, ReactNode>; //todo: fjerne denne når vi går over til Sanity
    nullstillVedAvhengighetEndring?: boolean;
    flettefelter?: FlettefeltVerdier;
}) => {
    const { plainTekst } = useApp();
    const inputFelt = useFelt<string>({
        feltId: søknadsfelt ? søknadsfelt.id : uuidv4(),
        verdi: søknadsfelt
            ? trimWhiteSpace(formaterInitVerdiForInputMedUkjent(søknadsfelt.svar))
            : '',
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter): FeltState<string> => {
            const feltVerdi = trimWhiteSpace(felt.verdi);
            if (avhengigheter?.vetIkkeCheckbox?.verdi === ESvar.JA) {
                return ok(felt);
            }

            if (erFnrInput) {
                if (feltVerdi === '') {
                    return feil(
                        felt,
                        feilmeldingSpråkId ? (
                            <SpråkTekst id={feilmeldingSpråkId} />
                        ) : (
                            plainTekst(feilmelding, flettefelter)
                        )
                    );
                } else if (idnr(feltVerdi).status !== 'valid') {
                    return feil(felt, <SpråkTekst id={'felles.fnr.feil-format.feilmelding'} />);
                } else {
                    return customValidering ? customValidering(felt) : ok(felt);
                }
            } else {
                return feltVerdi !== ''
                    ? customValidering
                        ? customValidering(felt)
                        : ok(felt)
                    : feil(
                          felt,
                          feilmeldingSpråkId ? (
                              <SpråkTekst id={feilmeldingSpråkId} values={språkVerdier} />
                          ) : (
                              plainTekst(feilmelding, flettefelter)
                          )
                      );
            }
        },
        avhengigheter: { vetIkkeCheckbox: avhengighet, skalVises },
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });
    useEffect(() => {
        if (avhengighet.verdi === ESvar.JA) {
            inputFelt.validerOgSettFelt('', avhengighet);
        } else {
            inputFelt.verdi && inputFelt.validerOgSettFelt(inputFelt.verdi);
        }
    }, [avhengighet]);

    return inputFelt;
};

export default useInputFeltMedUkjent;
