import type { ESvar } from '@navikt/familie-form-elements';
import { type Avhengigheter, type Felt, type FeltState, feil, ok, useFelt } from '@navikt/familie-skjema';
import type { Alpha3Code } from 'i18n-iso-countries';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { FlettefeltVerdier } from '../../common/typer/kontrakt/generelle';
import type { LocaleRecordBlock } from '../../common/typer/locale';
import { useAppContext } from '../context/AppContext';
import type { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    feilmelding,
    avhengigSvarCondition,
    avhengighet,
    nullstillVedAvhengighetEndring = true,
    skalFeltetVises = true,
    flettefelter,
}: {
    søknadsfelt?: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmelding: LocaleRecordBlock;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    nullstillVedAvhengighetEndring?: boolean;
    skalFeltetVises?: boolean;
    flettefelter?: FlettefeltVerdier;
}) => {
    const { plainTekst } = useAppContext();
    const skalViseFelt = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const landDropdown = useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt ? søknadsfelt.id : uuidv4(),
        verdi: søknadsfelt?.svar ?? '',
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            if (!skalFeltetVises) {
                return false;
            }
            return (avhengigheter?.jaNeiSpm as Felt<ESvar | null>) ? skalViseFelt(avhengigheter.jaNeiSpm.verdi) : true;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>) => {
            return felt.verdi !== '' ? ok(felt) : feil(felt, plainTekst(feilmelding, { ...flettefelter }));
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalViseFelt(avhengighet.verdi);

        if (skalVises && landDropdown.verdi !== '') {
            landDropdown.validerOgSettFelt(landDropdown.verdi);
        }
        return () => {
            if (!skalViseFelt(avhengighet.verdi)) {
                landDropdown.validerOgSettFelt('');
            }
        };
    }, [avhengighet]);

    return landDropdown;
};

export default useLanddropdownFeltMedJaNeiAvhengighet;
