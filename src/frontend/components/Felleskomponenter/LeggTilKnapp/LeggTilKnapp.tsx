import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

interface Props {
    onClick: () => void | Promise<void>;
    forklaring?: ReactNode;
    feilmelding: ReactNode;
    id?: string;
    children?: ReactNode;
}

const StyledButton = styled(Button)`
    && {
        border: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
    }
`;

export function LeggTilKnapp({
    onClick,
    forklaring = undefined,
    feilmelding,
    id,
    children,
}: Props) {
    return (
        <>
            {forklaring && <BodyShort>{forklaring}</BodyShort>}
            <StyledButton
                id={id}
                variant={'tertiary'}
                type={'button'}
                onClick={onClick}
                $feilmelding={!!feilmelding}
                icon={<PlusCircleIcon aria-hidden />}
            >
                {children}
            </StyledButton>
            {!!feilmelding && <ErrorMessage>{feilmelding}</ErrorMessage>}
        </>
    );
}
