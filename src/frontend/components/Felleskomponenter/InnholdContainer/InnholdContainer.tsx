import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { device } from '../../../Theme';

interface Props {
    className?: string;
    children?: ReactNode;
}

const Container = styled.div`
    max-width: var(--innhold-bredde);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 2rem auto 4rem auto;

    @media all and ${device.tablet} {
        max-width: 100%;
        margin: 2rem 2rem 4rem 2rem;
    }
`;

function InnholdContainer({ className, children }: Props) {
    return <Container className={className}>{children}</Container>;
}

export default InnholdContainer;
