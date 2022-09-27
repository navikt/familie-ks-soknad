import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Innholdstittel } from 'nav-frontend-typografi';

import { Button, Modal } from '@navikt/ds-react';

import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledButton = styled(Button)`
    && {
        margin-top: 4rem;
        white-space: normal;
        max-width: 100%;
        box-sizing: border-box;
    }
`;
const StyledInnholdstittel = styled(Innholdstittel)`
    text-align: center;
    padding: 2rem 0;
`;

const SkjemaModal: React.FC<{
    erÅpen: boolean;
    toggleModal: () => void;
    /** @deprecated **/
    modalTittelSpråkId?: string; //todo: fjerne når vi har gått over til sanity
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    /** @deprecated **/
    submitKnappSpråkId?: string; //todo: fjerne når vi har gått over til sanity
    onSubmitCallback: () => void;
    tittel?: ReactNode;
    submitKnappTekst?: ReactNode;
}> = ({
    erÅpen,
    toggleModal,
    modalTittelSpråkId,
    submitSpinner = false,
    valideringErOk,
    onAvbrytCallback,
    submitKnappSpråkId,
    onSubmitCallback,
    tittel,
    submitKnappTekst,
    children,
}) => {
    return (
        <Modal
            open={erÅpen}
            onClose={() => {
                toggleModal();
                onAvbrytCallback && onAvbrytCallback();
            }}
        >
            <ModalContent>
                {modalTittelSpråkId && (
                    <StyledInnholdstittel>
                        <SpråkTekst id={modalTittelSpråkId} />
                    </StyledInnholdstittel>
                )}
                {tittel}
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
                        {submitKnappSpråkId && <SpråkTekst id={submitKnappSpråkId} />}
                        {submitKnappTekst}
                    </StyledButton>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default SkjemaModal;
