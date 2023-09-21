import React, { ReactNode } from 'react';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { LocaleRecordBlock, Typografi } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

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
            aria-label={plainTekst(tittel, flettefelter)}
            width={'medium'}
            portal={true}
        >
            <Modal.Header>
                {tittel && (
                    <TekstBlock
                        block={tittel}
                        flettefelter={flettefelter}
                        typografi={Typografi.ModalHeadingH1}
                    />
                )}
            </Modal.Header>
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
