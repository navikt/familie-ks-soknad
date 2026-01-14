import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Box, Button, ErrorMessage, FormSummary } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

interface Props {
    onClick: () => void | Promise<void>;
    leggTilFlereTekst: ReactNode;
    feilmelding: ReactNode;
    id?: string;
    children?: ReactNode;
}

const StyledButton = styled(Button)`
    && {
        border: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
    }
`;

export function LeggTilKnapp({ onClick, leggTilFlereTekst, feilmelding, id, children }: Props) {
    return (
        <FormSummary.Answer>
            <FormSummary.Label>{leggTilFlereTekst}</FormSummary.Label>
            <FormSummary.Value>
                <StyledButton
                    id={id}
                    variant="tertiary"
                    type="button"
                    onClick={onClick}
                    $feilmelding={!!feilmelding}
                    icon={<PlusCircleIcon aria-hidden />}
                >
                    {children}
                </StyledButton>
            </FormSummary.Value>
            {!!feilmelding && (
                <Box marginBlock="2 0">
                    <ErrorMessage>{feilmelding}</ErrorMessage>
                </Box>
            )}
        </FormSummary.Answer>
    );
}
