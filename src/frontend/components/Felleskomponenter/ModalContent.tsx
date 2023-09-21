import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Modal } from '@navikt/ds-react';

interface Props {
    children?: ReactNode;
}

const StyledModalContent = styled(Modal.Body)`
    && {
        padding: 2rem;
    }
`;

function ModalContent({ children }: Props) {
    return <StyledModalContent>{children}</StyledModalContent>;
}

export default ModalContent;
