import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { LocaleRecordBlock, Typografi } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

interface Props {
    erÅpen: boolean;
    toggleModal: () => void;
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    onSubmitCallback: () => void;
    tittel: LocaleRecordBlock;
    submitKnappTekst: ReactNode;
    flettefelter?: FlettefeltVerdier;
    children?: ReactNode;
}

const StyledButton = styled(Button)`
    && {
        margin-top: 4rem;
        white-space: normal;
        max-width: 100%;
        box-sizing: border-box;
    }
`;

function SkjemaModal({
    erÅpen,
    toggleModal,
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
                toggleModal();
                onAvbrytCallback && onAvbrytCallback();
            }}
            aria-label={plainTekst(tittel, flettefelter)}
        >
            <ModalContent>
                {tittel && (
                    <TekstBlock
                        block={tittel}
                        flettefelter={flettefelter}
                        typografi={Typografi.ModalHeadingH1}
                    />
                )}
                <form>
                    {children}
                    <StyledButton
                        variant={valideringErOk() ? 'primary' : 'secondary'}
                        type={'submit'}
                        data-testid={'submit-knapp-i-modal'}
                        loading={!!submitSpinner}
                        onClick={event => {
                            event.preventDefault();
                            onSubmitCallback();
                        }}
                    >
                        {submitKnappTekst}
                    </StyledButton>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default SkjemaModal;
