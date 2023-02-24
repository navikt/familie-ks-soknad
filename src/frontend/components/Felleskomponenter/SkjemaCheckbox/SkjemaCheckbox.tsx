import React, { ReactNode } from 'react';

import { Checkbox } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt, Valideringsstatus } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';

export const SkjemaCheckbox: React.FC<{
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    label: ReactNode;
}> = ({ felt, visFeilmeldinger = false, label }) => {
    useFørsteRender(() => {
        felt.validerOgSettFelt(felt.verdi);
    });

    return felt.erSynlig ? (
        <Checkbox
            checked={felt.verdi === ESvar.JA}
            error={visFeilmeldinger && felt.valideringsstatus === Valideringsstatus.FEIL}
            onChange={event => felt.validerOgSettFelt(event.target.checked ? ESvar.JA : ESvar.NEI)}
        >
            {label}
        </Checkbox>
    ) : null;
};
