import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { Button } from '@navikt/ds-react';

import AlertStripe from '../AlertStripe/AlertStripe';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledNormalTekst = styled(Normaltekst)`
    && {
        margin: 2.5rem 0;
    }
`;

export const StyledSideTittel = styled(Sidetittel)`
    && {
        font-size: 1.25rem;
        margin: 1rem auto;
    }
`;

const StyledButton = styled(Button)`
    && {
        width: fit-content;
    }
`;

const ModalInnholdContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    max-width: 35rem;
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { formatMessage } = useIntl();

    const refresh = () => window.location.reload();

    return (
        <Modal
            isOpen={erÅpen}
            contentLabel={formatMessage({ id: 'felles.modal.deployfeil.tittel' })}
            onRequestClose={refresh}
        >
            <ModalInnholdContainer>
                <StyledSideTittel>
                    <SpråkTekst id={'felles.modal.deployfeil.tittel'} />
                </StyledSideTittel>

                <AlertStripe
                    form={'default'}
                    type={'feil'}
                    children={<SpråkTekst id={'felles.modal.deployfeil.error'} />}
                />
                <StyledNormalTekst>
                    <SpråkTekst id={'felles.modal.deployfeil.info'} />
                </StyledNormalTekst>

                <StyledButton onClick={refresh}>
                    <SpråkTekst id={'felles.modal.deployfeil.knapp'} />
                </StyledButton>
            </ModalInnholdContainer>
        </Modal>
    );
};

export default ModellVersjonModal;
