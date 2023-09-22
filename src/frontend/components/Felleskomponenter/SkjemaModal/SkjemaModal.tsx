import React, { ReactNode } from 'react';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { LocaleRecordBlock } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import ModalContent from '../ModalContent';

interface Props {
    erÅpen: boolean;
    lukkModal: () => void;
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    onSubmitCallback: () => void;
    tittel: LocaleRecordBlock;
    submitKnappTekst: ReactNode;
    flettefelter?: FlettefeltVerdier;
    children?: ReactNode;
}

function SkjemaModal({
    erÅpen,
    lukkModal,
    submitSpinner = false,
    valideringErOk,
    onAvbrytCallback,
    onSubmitCallback,
    tittel,
    submitKnappTekst,
    flettefelter,
    children,
}: Props) {
    const { plainTekst } = useApp();
    return (
        <Modal
            open={erÅpen}
            onClose={() => {
                lukkModal();
                onAvbrytCallback && onAvbrytCallback();
            }}
            width={'medium'}
            portal={true}
            header={{
                heading: plainTekst(tittel, flettefelter),
                size: 'medium',
            }}
        >
            <ModalContent>
                <form id="skjema">{children}</form>
            </ModalContent>
            <Modal.Footer>
                <Button
                    form="skjema"
                    variant={valideringErOk() ? 'primary' : 'secondary'}
                    data-testid={'submit-knapp-i-modal'}
                    loading={!!submitSpinner}
                    onClick={event => {
                        event.preventDefault();
                        onSubmitCallback();
                    }}
                >
                    {submitKnappTekst}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SkjemaModal;
