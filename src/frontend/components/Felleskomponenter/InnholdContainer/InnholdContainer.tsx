import React from 'react';

import styled from 'styled-components';

import { device } from '../../../Theme';

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

const InnholdContainer: React.FC<{ className?: string }> = ({ children, className }) => {
    return <Container className={className}>{children}</Container>;
};

export default InnholdContainer;
