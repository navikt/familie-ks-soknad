import { useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type Felt, type FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useAppContext } from '../context/AppContext';
import { DatoMedUkjent, LocaleRecordBlock } from '../typer/common';
import { FlettefeltVerdier } from '../typer/kontrakt/generelle';
import { IdNummerKey } from '../typer/skjema';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent } from '../utils/input';

const useInputFeltMedUkjent = ({
    søknadsfelt,
    avhengighet,
    feilmelding,
    erFnrInput = false,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    flettefelter,
}: {
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent> | { id: IdNummerKey; svar: string } | null;
    avhengighet: Felt<ESvar>;
    feilmelding: LocaleRecordBlock;
    erFnrInput?: boolean;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    flettefelter?: FlettefeltVerdier;
}) => {
    const { plainTekst, tekster } = useAppContext();
    const { ugyldigFoedselsnummer } = tekster().FELLES.formateringsfeilmeldinger;
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

            const feilmelding = avhengigheter?.feilmelding as LocaleRecordBlock;

            if (erFnrInput) {
                if (feltVerdi === '') {
                    return feil(felt, plainTekst(feilmelding, flettefelter));
                } else if (erFnrInput && idnr(feltVerdi).status !== 'valid') {
                    return feil(felt, plainTekst(ugyldigFoedselsnummer));
                } else {
                    return customValidering ? customValidering(felt) : ok(felt);
                }
            } else {
                return feltVerdi !== ''
                    ? customValidering
                        ? customValidering(felt)
                        : ok(felt)
                    : feil(felt, plainTekst(feilmelding, flettefelter));
            }
        },
        avhengigheter: { vetIkkeCheckbox: avhengighet, skalVises, feilmelding },
        skalFeltetVises: avhengigheter => avhengigheter?.skalVises,
        nullstillVedAvhengighetEndring,
    });
    useEffect(() => {
        if (avhengighet.verdi === ESvar.JA) {
            inputFelt.validerOgSettFelt('', avhengighet);
        } else {
            if (inputFelt.verdi) {
                inputFelt.validerOgSettFelt(inputFelt.verdi);
            }
        }
    }, [avhengighet]);

    return inputFelt;
};

export default useInputFeltMedUkjent;
