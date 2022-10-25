import React from 'react';

import styled from 'styled-components';

import { Modal } from '@navikt/ds-react';

import { device } from '../../Theme';

const StyledModalContent = styled(Modal.Content)`
    && {
        padding: 2rem;
    }

    > h1 {
        text-align: center;
        padding: 2rem 0;
    }

    max-width: 45rem;
    min-width: 45rem;

    @media all and ${device.tablet} {
        min-width: auto;
    }
`;

const ModalContent: React.FC = ({ children }) => {
    return <StyledModalContent>{children}</StyledModalContent>;
};

export default ModalContent;
