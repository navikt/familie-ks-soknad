import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Avhengigheter, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { LocaleRecordBlock } from '../typer/common';
import { validerDato } from '../utils/dato';

const useDatovelgerFeltMedUkjent = ({
    feltId,
    initiellVerdi,
    vetIkkeCheckbox,
    feilmelding,
    skalFeltetVises,
    nullstillVedAvhengighetEndring = true,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
    customStartdatoFeilmelding = '',
    avhengigheter,
}: {
    feltId;
    initiellVerdi: ISODateString;
    vetIkkeCheckbox: Felt<ESvar>;
    feilmelding: LocaleRecordBlock;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    customStartdatoFeilmelding?: string;
    avhengigheter?: Avhengigheter;
}) => {
    const { plainTekst, tekster } = useApp();
    const datoFelt = useFelt<ISODateString>({
        feltId: feltId,
        verdi: initiellVerdi,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }

            const feilmelding = avhengigheter && (avhengigheter.feilmelding as LocaleRecordBlock);
            const customStartdatoFeilmelding =
                avhengigheter && avhengigheter.customStartdatoFeilmelding;

            return validerDato({
                tekster: tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                feltState: felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning,
                customStartdatoFeilmelding,
            });
        },
        avhengigheter: {
            vetIkkeCheckbox,
            skalFeltetVises,
            customStartdatoFeilmelding,
            feilmelding,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalFeltetVises,
    });

    useEffect(() => {
        vetIkkeCheckbox.verdi === ESvar.JA &&
            datoFelt.validerOgSettFelt(datoFelt.verdi, vetIkkeCheckbox);
    }, [vetIkkeCheckbox]);

    useEffect(() => {
        skalFeltetVises &&
            datoFelt.verdi !== '' &&
            datoFelt.validerOgSettFelt(datoFelt.verdi, vetIkkeCheckbox);

        return () => {
            !skalFeltetVises && datoFelt.validerOgSettFelt('', vetIkkeCheckbox);
        };
    }, [skalFeltetVises, vetIkkeCheckbox]);

    return datoFelt;
};

export default useDatovelgerFeltMedUkjent;
