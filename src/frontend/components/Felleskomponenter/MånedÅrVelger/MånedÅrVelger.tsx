import React, { useState } from 'react';

import { formatISO, lastDayOfMonth } from 'date-fns';

import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import type { Felt } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { ISODateString } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';

interface MånedÅrVelgerProps {
    tidligsteValgbareMåned?: Date;
    senesteValgbareMåned?: Date;
    label: React.ReactNode;
    felt: Felt<ISODateString>;
    visFeilmeldinger?: boolean;
    disabled?: boolean;
    dagIMåneden: DagIMåneden;
    kanIkkeVæreFortid?: boolean;
    kanIkkeVæreFremtid?: boolean;
}

/* TODO
- vurder å lagre som Date og gjøre parsing/format mot mellomlagring og innsending - i neste runde
*/

enum Feilmelding {
    FØR_MIN_DATO = 'FØR_MIN_DATO',
    ETTER_MAKS_DATO = 'ETTER_MAKS_DATO',
    UGYLDIG_DATO = 'UGYLDIG_DATO',
    DATO_IKKE_I_FORTID = 'DATO_IKKE_I_FORTID',
    DATO_IKKE_I_FREMTID = 'DATO_IKKE_I_FREMTID',
}

export enum DagIMåneden {
    FØRSTE_DAG = 'FØRSTE_DAG',
    SISTE_DAG = 'SISTE_DAG',
}

export const MånedÅrVelger: React.FC<MånedÅrVelgerProps> = ({
    tidligsteValgbareMåned,
    senesteValgbareMåned,
    label,
    felt,
    visFeilmeldinger = false,
    disabled = false,
    dagIMåneden = DagIMåneden.FØRSTE_DAG,
    kanIkkeVæreFortid,
    kanIkkeVæreFremtid,
}) => {
    const { valgtLocale } = useSpråkContext();
    const { tekster, plainTekst } = useAppContext();
    const [error, setError] = useState<Feilmelding | undefined>(undefined);

    const { manedformatPlaceholder } = tekster().FELLES.hjelpeteksterForInput;

    const formateringsfeilmeldinger = tekster()[ESanitySteg.FELLES].formateringsfeilmeldinger;

    const nullstillOgSettFeilmelding = (feilmelding: Feilmelding) => {
        if (error !== feilmelding) {
            setError(feilmelding);
            felt.nullstill();
        }
    };

    const feilmeldinger: Record<Feilmelding, string> = {
        UGYLDIG_DATO: plainTekst(formateringsfeilmeldinger.ugyldigManed),
        FØR_MIN_DATO: plainTekst(formateringsfeilmeldinger.datoErForForsteGyldigeTidspunkt),
        ETTER_MAKS_DATO: plainTekst(formateringsfeilmeldinger.datoErEtterSisteGyldigeTidspunkt),
        DATO_IKKE_I_FORTID: plainTekst(formateringsfeilmeldinger.datoKanIkkeVareIFortid),
        DATO_IKKE_I_FREMTID: plainTekst(formateringsfeilmeldinger.datoKanIkkeVareIFremtid),
    };

    const { monthpickerProps, inputProps } = useMonthpicker({
        fromDate: tidligsteValgbareMåned,
        toDate: senesteValgbareMåned,
        locale: valgtLocale,
        onMonthChange: (dato: Date | undefined): void => {
            if (dato === undefined) {
                felt.nullstill();
            } else {
                if (dagIMåneden === DagIMåneden.FØRSTE_DAG) {
                    felt.validerOgSettFelt(formatISO(dato, { representation: 'date' }));
                } else {
                    felt.validerOgSettFelt(formatISO(lastDayOfMonth(dato), { representation: 'date' }));
                }
            }
        },
        onValidate: val => {
            if (val.isBefore && kanIkkeVæreFortid) {
                nullstillOgSettFeilmelding(Feilmelding.DATO_IKKE_I_FORTID);
            } else if (val.isAfter && kanIkkeVæreFremtid) {
                nullstillOgSettFeilmelding(Feilmelding.DATO_IKKE_I_FREMTID);
            } else if (val.isBefore) {
                nullstillOgSettFeilmelding(Feilmelding.FØR_MIN_DATO);
            } else if (val.isAfter) {
                nullstillOgSettFeilmelding(Feilmelding.ETTER_MAKS_DATO);
            } else if (val.isEmpty || val.isDisabled || !val.isValidMonth) {
                nullstillOgSettFeilmelding(Feilmelding.UGYLDIG_DATO);
            } else {
                setError(undefined);
            }
        },
    });

    return (
        <MonthPicker {...monthpickerProps}>
            <MonthPicker.Input
                {...inputProps}
                label={label}
                placeholder={plainTekst(manedformatPlaceholder)}
                disabled={disabled}
                error={
                    error && visFeilmeldinger
                        ? feilmeldinger[error]
                        : felt.hentNavBaseSkjemaProps(visFeilmeldinger).error
                }
            />
        </MonthPicker>
    );
};
