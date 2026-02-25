import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Box, Button, ErrorMessage, FormSummary } from '@navikt/ds-react';

interface Props {
    onClick: () => void | Promise<void>;
    leggTilFlereTekst: ReactNode;
    feilmelding: ReactNode;
    id?: string;
    children?: ReactNode;
}

const StyledButton = styled(Button)`
    && {
        border: ${props => (props.$feilmelding ? `2px solid var(--ax-border-danger)` : 'none')};
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
                {!!feilmelding && (
                    <Box marginBlock="space-8 space-0">
                        <ErrorMessage showIcon>{feilmelding}</ErrorMessage>
                    </Box>
                )}
            </FormSummary.Value>
        </FormSummary.Answer>
    );
}
