import React, { ReactNode, useEffect } from 'react';

import { formatISO, isAfter, startOfDay } from 'date-fns';

import { BodyShort, ErrorMessage, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { ISODateString } from '../../../typer/common';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    parseTilGyldigDato,
    stringTilDate,
    tidenesEnde,
    tidenesMorgen,
} from '../../../utils/dato';

interface DatoVelgerProps {
    felt: Felt<ISODateString>;
    avgrensDatoFremITid?: boolean;
    avgrensMaxDato?: Date;
    avgrensMinDato?: Date;
    tilhørendeFraOgMedFelt?: Felt<ISODateString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    label: ReactNode;
    disabled?: boolean;
    dynamisk?: boolean;
    strategy?: 'absolute' | 'fixed';
}

const Datovelger: React.FC<DatoVelgerProps> = ({
    felt,
    avgrensDatoFremITid = false,
    avgrensMaxDato,
    avgrensMinDato,
    tilhørendeFraOgMedFelt,
    skjema,
    label,
    disabled = false,
    dynamisk = false,
    strategy = 'fixed',
}) => {
    const [valgtLocale] = useSprakContext();
    const { tekster, plainTekst } = useApp();
    const { datoformatHjelpetekst, datoformatPlaceholder } = tekster().FELLES.hjelpeteksterForInput;

    const minDatoErIFremtiden = () =>
        tilhørendeFraOgMedFelt?.verdi &&
        hentFromDate() !== undefined &&
        isAfter(hentFromDate() as Date, dagensDato());

    const hentFromDate = (): Date | undefined => {
        let minDato = tidenesMorgen();

        if (avgrensMinDato) {
            minDato = avgrensMinDato;
        } else if (tilhørendeFraOgMedFelt?.verdi) {
            minDato = dagenEtterDato(stringTilDate(tilhørendeFraOgMedFelt.verdi));
        }
        return minDato;
    };

    const hentToDate = (): Date => {
        let maxDato = tidenesEnde();

        if (avgrensDatoFremITid || avgrensMaxDato) {
            maxDato = avgrensMaxDato ? avgrensMaxDato : dagensDato();
        }

        return maxDato;
    };

    const { datepickerProps, inputProps, reset } = UNSAFE_useDatepicker({
        locale: valgtLocale,
        fromDate: hentFromDate(),
        toDate: hentToDate(),
        today: minDatoErIFremtiden() ? hentFromDate() : dagensDato(),
        defaultSelected: parseTilGyldigDato(felt.verdi, 'yyyy-MM-dd'),
        onDateChange: (dato: Date | undefined) => {
            if (dato) {
                felt.validerOgSettFelt(formatISO(dato, { representation: 'date' }));
            }
        },
    });

    useEffect(() => {
        minDatoErIFremtiden() && reset();
    }, [tilhørendeFraOgMedFelt?.verdi]);

    useEffect(() => {
        if (inputProps.value && inputProps.value !== '' && !disabled) {
            const parsetDato = parseTilGyldigDato(inputProps.value.toString(), 'dd.MM.yyyy');
            felt.validerOgSettFelt(
                parsetDato
                    ? formatISO(startOfDay(parsetDato), { representation: 'date' })
                    : inputProps.value.toString()
            );
        }
    }, [inputProps.value, disabled]);

    return felt.erSynlig ? (
        <div aria-live={dynamisk ? 'polite' : 'off'}>
            <UNSAFE_DatePicker dropdownCaption strategy={strategy} {...datepickerProps}>
                <UNSAFE_DatePicker.Input
                    {...inputProps}
                    disabled={disabled}
                    size={'medium'}
                    label={label}
                    description={<BodyShort>{plainTekst(datoformatHjelpetekst)}</BodyShort>}
                    placeholder={plainTekst(datoformatPlaceholder)}
                    error={!!(felt.feilmelding && skjema.visFeilmeldinger)}
                />
            </UNSAFE_DatePicker>
            {skjema.visFeilmeldinger && <ErrorMessage>{felt.feilmelding}</ErrorMessage>}
        </div>
    ) : null;
};

export default Datovelger;
