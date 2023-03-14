import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { AddCircle } from '@navikt/ds-icons';
import { Button, ErrorMessage } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

interface Props {
    onClick: () => void | Promise<void>;
    feilmelding: ReactNode;
    id?: string;
}

const StyledButton = styled(Button)`
    && {
        margin: 0.5rem 0 0.5rem 0;
        border: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({ onClick, feilmelding, id, children }) => (
    <>
        <StyledButton
            id={id}
            variant={'tertiary'}
            type={'button'}
            onClick={onClick}
            $feilmelding={!!feilmelding}
            icon={<AddCircle />}
        >
            {children}
        </StyledButton>
        {!!feilmelding && <ErrorMessage>{feilmelding}</ErrorMessage>}
    </>
);
