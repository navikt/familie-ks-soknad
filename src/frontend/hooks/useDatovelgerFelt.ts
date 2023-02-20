import { ISODateString } from '@navikt/familie-form-elements';
import { Avhengigheter, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { LocaleRecordBlock } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFelt = ({
    søknadsfelt,
    skalFeltetVises,
    feilmelding,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
    avhengigheter,
    nullstillVedAvhengighetEndring = true,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    skalFeltetVises: boolean;
    feilmelding: LocaleRecordBlock;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    avhengigheter?: Avhengigheter;
    nullstillVedAvhengighetEndring?: boolean;
}) => {
    const { plainTekst, tekster } = useApp();
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const feilmelding = avhengigheter && (avhengigheter.feilmelding as LocaleRecordBlock);

            return validerDato({
                tekster: tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                feltState: felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning,
            });
        },
        skalFeltetVises: avhengigheter => avhengigheter?.skalFeltetVises,
        avhengigheter: {
            skalFeltetVises,
            feilmelding,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
    });
};

export default useDatovelgerFelt;
