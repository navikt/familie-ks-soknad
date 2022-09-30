import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Feilmelding } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { NavdsGlobalColorRed500 } from '@navikt/ds-tokens/dist/tokens';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    /** @deprecated **/
    språkTekst?: string; //todo: legacy - fjerne når vi er ferdig med sanity
    feilmelding?: ReactNode;
    id?: string;
}

const StyledButton = styled(Button)`
    && {
        margin: 0.5rem 0 0.5rem 0;
        border: ${props => (props.$feilmelding ? `2px solid ${NavdsGlobalColorRed500}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({
    onClick,
    språkTekst,
    feilmelding,
    id,
    children,
}) => (
    <>
        <StyledButton
            id={id}
            variant={'tertiary'}
            type={'button'}
            onClick={onClick}
            $feilmelding={!!feilmelding}
        >
            <AddCircle />
            {språkTekst && <SpråkTekst id={språkTekst} />}
            {children}
        </StyledButton>
        {!!feilmelding && <Feilmelding>{feilmelding}</Feilmelding>}
    </>
);
