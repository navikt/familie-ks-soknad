import React, { ReactNode, useEffect } from 'react';

import dayjs from 'dayjs';

import { Feilmelding } from 'nav-frontend-typografi';

import { BodyShort, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import { ISODateString } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { dagenEtterDato, dagensDato, tidenesEnde, tidenesMorgen } from '../../../utils/dato';

interface DatoVelgerProps {
    felt: Felt<ISODateString>;
    avgrensDatoFremITid?: boolean;
    avgrensMaxDato?: ISODateString;
    avgrensMinDato?: ISODateString;
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

    useEffect(() => {
        felt.validerOgSettFelt(felt.verdi);
    }, [tilhørendeFraOgMedFelt?.verdi, avgrensMaxDato]);

    const hentFromDate = (): Date | undefined => {
        let minDato = tidenesMorgen();

        if (avgrensMinDato) {
            minDato = new Date(avgrensMinDato);
        } else if (tilhørendeFraOgMedFelt?.verdi) {
            minDato = new Date(dagenEtterDato(tilhørendeFraOgMedFelt.verdi));
        }
        return minDato;
    };

    const hentToDate = (): Date => {
        let maxDato = tidenesEnde();

        if (avgrensDatoFremITid || avgrensMaxDato) {
            maxDato = avgrensMaxDato ? new Date(avgrensMaxDato) : new Date(dagensDato());
        }

        return maxDato;
    };

    const { datepickerProps, inputProps, reset } = UNSAFE_useDatepicker({
        locale: valgtLocale,
        fromDate: hentFromDate(),
        toDate: hentToDate(),
        today: hentFromDate(),
        defaultSelected: felt.verdi ? new Date(felt.verdi) : undefined,
        onDateChange: dato => {
            dato && felt.hentNavInputProps(false).onChange(dato.toISOString().split('T')[0]);
        },
    });

    useEffect(() => {
        dayjs(hentFromDate()).isAfter(dayjs()) && reset();
    }, [tilhørendeFraOgMedFelt?.verdi]);

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
            {skjema.visFeilmeldinger && <Feilmelding>{felt.feilmelding}</Feilmelding>}
        </div>
    ) : null;
};

export default Datovelger;
