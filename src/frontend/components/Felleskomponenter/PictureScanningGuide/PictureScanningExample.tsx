import React from 'react';

import styled from 'styled-components';

import { Element } from 'nav-frontend-typografi';

import StatusIkon, { StatusIconStatusKey } from './StatusIcon';

interface Props {
    image: React.ReactNode;
    status: StatusIconStatusKey;
    statusText: string;
    description: string;
}

const ImageContainer = styled.div`
    padding-left: 1rem;
    margin-bottom: 0.75rem;
`;

const StyledElement = styled(Element)`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
`;

const StatusIkonContainer = styled.span`
    padding-right: 0.5rem;
    line-height: 0;
`;

const PictureScanningExample = ({ image, status, statusText, description }: Props) => (
    <div>
        <ImageContainer>{image}</ImageContainer>
        <StyledElement tag="div">
            <StatusIkonContainer role="presentation">
                <StatusIkon status={status} />
            </StatusIkonContainer>
            {statusText}
        </StyledElement>
        <div>{description}</div>
    </div>
);

export default PictureScanningExample;
