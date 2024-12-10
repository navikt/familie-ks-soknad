import React, { ReactNode } from 'react';

import { TextField, type TextFieldProps } from '@navikt/ds-react';
import type { Felt } from '@navikt/familie-skjema';

interface SkjemaFeltInputProps extends TextFieldProps {
    // eslint-disable-next-line
    felt: Felt<any>;
    visFeilmeldinger: boolean;
    label: ReactNode;
    tilleggsinfo?: ReactNode;
}

/**
 * Henter input props fra felt, og fra props. Props overstyrer felt.
 */
export const SkjemaFeltInput: React.FC<SkjemaFeltInputProps> = props => {
    const {
        felt,
        label,
        visFeilmeldinger,
        tilleggsinfo,
        autoComplete = 'off',
        ...øvrigePropsStøttetAvTextField
    } = props;
    const navInputPropsFraFeltHook = felt.hentNavInputProps(visFeilmeldinger);

    return felt.erSynlig ? (
        <TextField
            autoComplete={autoComplete}
            label={label}
            description={tilleggsinfo}
            {...navInputPropsFraFeltHook}
            {...øvrigePropsStøttetAvTextField}
            maxLength={500}
        />
    ) : null;
};
