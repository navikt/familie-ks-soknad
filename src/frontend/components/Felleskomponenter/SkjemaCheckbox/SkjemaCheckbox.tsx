import React from 'react';

import { Checkbox, ErrorMessage } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt } from '@navikt/familie-skjema';

export const SkjemaCheckbox: React.FC<{
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    label: string;
}> = ({ felt, visFeilmeldinger = false, label }) => {
    return felt.erSynlig ? (
        <div>
            <Checkbox
                checked={felt.verdi === ESvar.JA}
                onChange={event => felt.validerOgSettFelt(event.target.checked ? ESvar.JA : ESvar.NEI)}
            >
                {label}
            </Checkbox>
            {visFeilmeldinger && felt.feilmelding && <ErrorMessage>{felt.feilmelding}</ErrorMessage>}
        </div>
    ) : null;
};
