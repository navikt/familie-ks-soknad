import React from 'react';

import styled from 'styled-components';

import { Modal } from '@navikt/ds-react';

const StyledModalContent = styled(Modal.Content)`
    && {
        padding: 2rem;
    }

    > h1 {
        font-size: 1.25rem;
        text-align: center;
        padding: 2rem 0;
    }

    max-width: 45rem;
`;

const ModalContent: React.FC = ({ children }) => {
    return <StyledModalContent>{children}</StyledModalContent>;
};

export default ModalContent;
