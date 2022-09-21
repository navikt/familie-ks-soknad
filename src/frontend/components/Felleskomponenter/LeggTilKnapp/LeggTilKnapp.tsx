import React, { ReactNode } from 'react';

import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import { Feilmelding } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    /** @deprecated **/
    språkTekst?: string; //todo: legacy - fjerne når vi er ferdig med sanity
    feilmelding?: ReactNode;
    id?: string;
}

const StyledButton = styled(Button)<{ feilmelding: boolean }>`
    && {
        margin: 0.5rem 0 0.5rem 0;
        border: ${props => (props.$feilmelding ? `2px solid ${navFarger.redError}` : 'none')};
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
