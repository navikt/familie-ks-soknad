import React, { ReactNode } from 'react';

import { TextField, TextFieldProps } from '@navikt/ds-react';
import { Felt } from '@navikt/familie-skjema';

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
        ...øvrigePropsStøttetAvNavInput
    } = props;

    return felt.erSynlig ? (
        <TextField
            value={felt.verdi}
            onChange={value => felt.validerOgSettFelt(value.target.value)}
            error={visFeilmeldinger && felt.feilmelding}
            autoComplete={autoComplete}
            label={label}
            description={tilleggsinfo}
            {...øvrigePropsStøttetAvNavInput}
        />
    ) : null;
};
