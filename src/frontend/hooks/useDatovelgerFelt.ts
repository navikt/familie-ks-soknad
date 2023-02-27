import { Avhengigheter, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { ISODateString, LocaleRecordBlock } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFelt = ({
    søknadsfelt,
    skalFeltetVises,
    feilmelding,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
    avhengigheter,
    customStartdatoFeilmelding = '',
    nullstillVedAvhengighetEndring = true,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    skalFeltetVises: boolean;
    feilmelding: LocaleRecordBlock;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    avhengigheter?: Avhengigheter;
    nullstillVedAvhengighetEndring?: boolean;
    customStartdatoFeilmelding?: string;
}) => {
    const { plainTekst, tekster } = useApp();
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt, avhengigheter) => {
            const feilmelding = avhengigheter?.feilmelding as LocaleRecordBlock;

            return validerDato(
                tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning,
                customStartdatoFeilmelding
            );
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
