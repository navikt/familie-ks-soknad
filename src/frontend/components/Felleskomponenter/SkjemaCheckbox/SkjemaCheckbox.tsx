import React from 'react';

import styled from 'styled-components';

import { Checkbox, ErrorMessage } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

const CheckboxWrapper = styled.div`
    margin: 1rem 0;
`;

export const SkjemaCheckbox: React.FC<{
    felt: Felt<ESvar>;
    visFeilmeldinger?: boolean;
    label: string;
}> = ({ felt, visFeilmeldinger = false, label }) => {
    return felt.erSynlig ? (
        <CheckboxWrapper>
            <Checkbox
                checked={felt.verdi === ESvar.JA}
                aria-label={label}
                onChange={event =>
                    felt.validerOgSettFelt(event.target.checked ? ESvar.JA : ESvar.NEI)
                }
            >
                {label}
            </Checkbox>
            {visFeilmeldinger && <ErrorMessage>{felt.feilmelding}</ErrorMessage>}
        </CheckboxWrapper>
    ) : null;
};
