import React from 'react';

import styled from 'styled-components';

import { DeleteFilled } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { BarnetsId } from '../../../../typer/common';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledButton = styled(Button)`
    && {
        margin: 0.5rem 0 -1rem -0.75rem;
    }
`;

export const FjernBarnKnapp: React.FC<{
    barnId: BarnetsId;
    fjernBarnCallback: (ident: string) => void;
}> = ({ barnId, fjernBarnCallback }) => {
    return (
        <StyledButton
            type={'button'}
            variant={'tertiary'}
            onClick={() => fjernBarnCallback(barnId)}
        >
            <DeleteFilled aria-hidden />
            <SpråkTekst id={'hvilkebarn.fjern-barn.knapp'} />
        </StyledButton>
    );
};
