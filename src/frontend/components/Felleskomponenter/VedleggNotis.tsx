import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { FileTextIcon } from '@navikt/aksel-icons';

const NotisWrapper = styled.div`
    display: flex;
    margin-top: 1rem;
`;

const StyledFileContent = styled(FileTextIcon)`
    max-width: 1.5rem;
    min-width: 1.5rem;
    max-height: fit-content;
    margin-right: 1rem;
    font-size: 1.5rem;
`;

const NotisInnhold = styled.div`
    ul {
        margin: 0;
        padding-left: 1.3rem; // For kulepunkt
    }

    p {
        margin: 0;
    }
`;

export const VedleggNotis: React.FC<{
    children?: ReactNode;
    dynamisk?: boolean;
}> = ({ dynamisk = false, children }) => {
    return (
        <NotisWrapper aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledFileContent role={'img'} focusable={false} aria-label={'vedleggsikon'} />
            <NotisInnhold>{children ? children : null}</NotisInnhold>
        </NotisWrapper>
    );
};
