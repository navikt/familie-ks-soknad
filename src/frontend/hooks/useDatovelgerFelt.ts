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
    sluttdatoAvgrensning = '',
    startdatoAvgrensning = '',
    avhengigheter,
    nullstillVedAvhengighetEndring = false,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    skalFeltetVises: boolean;
    feilmelding: LocaleRecordBlock;
    sluttdatoAvgrensning?: ISODateString;
    startdatoAvgrensning?: ISODateString;
    avhengigheter?: Avhengigheter;
    nullstillVedAvhengighetEndring?: boolean;
}) => {
    const { plainTekst, tekster } = useApp();
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const startdatoAvgrensning = avhengigheter && avhengigheter.startdatoAvgrensning;
            const sluttdatoAvgrensning = avhengigheter && avhengigheter.sluttdatoAvgrensning;
            const feilmelding = avhengigheter && (avhengigheter.feilmelding as LocaleRecordBlock);

            return validerDato(
                tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
        },
        skalFeltetVises: avhengigheter => avhengigheter?.skalFeltetVises,
        avhengigheter: {
            sluttdatoAvgrensning,
            startdatoAvgrensning,
            skalFeltetVises,
            feilmelding,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
    });
};

export default useDatovelgerFelt;
