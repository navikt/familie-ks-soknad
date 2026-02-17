import React from 'react';

import { Button, Heading, Modal } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';

import styles from './SlettSøknadenModal.module.css';

interface ISlettSøkadenModalProps {
    open: boolean;
    avbryt: () => void;
    startPåNytt: () => void;
}

export const SlettSøknadenModal: React.FC<ISlettSøkadenModalProps> = ({ open, avbryt, startPåNytt }) => {
    const { tekster, plainTekst } = useAppContext();

    const startPåNyttTekster = tekster().FELLES.modaler.startPåNytt;

    return (
        <Modal open={open} onClose={avbryt} aria-labelledby="modal-heading">
            <Modal.Header>
                <Heading className={styles.heading} level="1" size="medium" id="modal-heading">
                    {plainTekst(startPåNyttTekster.startPaaNyttTittel)}
                </Heading>
            </Modal.Header>
            <Modal.Footer>
                <Button variant={'danger'} type="button" onClick={startPåNytt}>
                    {plainTekst(startPåNyttTekster.startNySoeknadKnapp)}
                </Button>
                <Button variant={'secondary'} type="button" onClick={avbryt}>
                    {plainTekst(startPåNyttTekster.startPaaNyttAvbryt)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
