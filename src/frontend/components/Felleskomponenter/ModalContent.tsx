import { Box, Modal } from '@navikt/ds-react';
import React, { type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

function ModalContent({ children }: Props) {
    return (
        <Modal.Body>
            <Box marginBlock={'space-16 space-0'}>{children}</Box>
        </Modal.Body>
    );
}

export default ModalContent;
