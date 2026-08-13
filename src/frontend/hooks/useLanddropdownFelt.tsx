import { type FeltState, feil, ok, useFelt } from '@navikt/familie-skjema';
import type { Alpha3Code } from 'i18n-iso-countries';

import type { LocaleRecordBlock } from '../../common/typer/locale';
import { useAppContext } from '../context/AppContext';
import type { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFelt = ({
    søknadsfelt,
    feilmelding,
    skalFeltetVises,
    nullstillVedAvhengighetEndring = false,
}: {
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmelding: LocaleRecordBlock;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
}) => {
    const { plainTekst } = useAppContext();
    return useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter?.skalFeltetVises;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>, avhengigheter) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, avhengigheter?.feilmelding ? plainTekst(avhengigheter?.feilmelding) : '');
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { skalFeltetVises, feilmelding },
    });
};

export default useLanddropdownFelt;
