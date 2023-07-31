import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Modal } from '@navikt/ds-react';

import { device } from '../../Theme';

interface Props {
    children?: ReactNode;
}

const StyledModalContent = styled(Modal.Content)`
    && {
        padding: 2rem;
    }

    > h1 {
        text-align: center;
        padding: 2rem 0;
    }

    width: 45rem;

    @media all and ${device.tablet} {
        width: auto;
    }
`;

function ModalContent({ children }: Props) {
    return <StyledModalContent>{children}</StyledModalContent>;
}

export default ModalContent;
