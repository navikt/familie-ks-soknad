import React, { ReactNode, useEffect } from 'react';

import dayjs from 'dayjs';
import { css } from 'styled-components';
import styled from 'styled-components';

import { Feilmelding } from 'nav-frontend-typografi';

import { BodyShort } from '@navikt/ds-react';
import { NavdsGlobalColorRed500 } from '@navikt/ds-tokens/dist/tokens';
import {
    DatepickerLimitations,
    FamilieDatovelger,
    ISODateString,
} from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';

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
    calendarPosition?: '' | 'fullscreen' | 'responsive';
}

const StyledFamilieDatovelger = styled(FamilieDatovelger)<{ feil: boolean }>`
    ${props =>
        props.feil &&
        css`
            .nav-datovelger:not(:hover) {
                input:not(:focus, :active),
                input:not(:focus, :active) + button {
                    border-color: ${NavdsGlobalColorRed500};
                }
                input:not(:focus, :active) {
                    box-shadow: 0 0 0 1px ${NavdsGlobalColorRed500};
                }
            }
        `}
`;

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
    calendarPosition = '',
}) => {
    const [valgtLocale] = useSprakContext();
    const { tekster, plainTekst } = useApp();
    const { datoformatHjelpetekst, datoformatPlaceholder } = tekster().FELLES.hjelpeteksterForInput;

    const hentBegrensninger = () => {
        const limitations: DatepickerLimitations = {};

        if (avgrensMinDato) {
            limitations.minDate = avgrensMinDato;
        } else if (tilhørendeFraOgMedFelt) {
            limitations.minDate = dayjs(tilhørendeFraOgMedFelt.verdi)
                .add(1, 'day')
                .format('YYYY-MM-DD');
        }

        if (avgrensDatoFremITid || avgrensMaxDato) {
            limitations.maxDate = avgrensMaxDato ? avgrensMaxDato : dagensDato();
        }

        return limitations;
    };

    useEffect(() => {
        felt.validerOgSettFelt(felt.verdi);
    }, [tilhørendeFraOgMedFelt?.verdi, avgrensMaxDato]);

    return felt.erSynlig ? (
        <div aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledFamilieDatovelger
                description={<BodyShort>{plainTekst(datoformatHjelpetekst)}</BodyShort>}
                allowInvalidDateSelection={false}
                limitations={hentBegrensninger()}
                placeholder={plainTekst(datoformatPlaceholder)}
                valgtDato={disabled ? '' : felt.verdi}
                label={label}
                {...felt.hentNavBaseSkjemaProps(skjema.visFeilmeldinger)}
                onChange={dato => {
                    felt.hentNavInputProps(false).onChange(dato);
                }}
                feil={!!(felt.feilmelding && skjema.visFeilmeldinger)}
                disabled={disabled}
                locale={valgtLocale}
                allowNavigationToDisabledMonths={false}
                calendarSettings={{ position: calendarPosition }}
            />
            {skjema.visFeilmeldinger && <Feilmelding>{felt.feilmelding}</Feilmelding>}
        </div>
    ) : null;
};

export default Datovelger;
