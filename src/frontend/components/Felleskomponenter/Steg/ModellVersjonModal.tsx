import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { Button, Modal } from '@navikt/ds-react';

import AlertStripe from '../AlertStripe/AlertStripe';
import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledNormalTekst = styled(Normaltekst)`
    && {
        margin: 2.5rem 0;
    }
`;

export const StyledSideTittel = styled(Sidetittel)`
    && {
        margin: 1rem auto;
    }
`;

const StyledButton = styled(Button)`
    && {
        width: fit-content;
    }
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { formatMessage } = useIntl();

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            aria-label={formatMessage({ id: 'felles.modal.deployfeil.tittel' })}
            onClose={refresh}
        >
            <ModalContent>
                <StyledSideTittel>
                    <SpråkTekst id={'felles.modal.deployfeil.tittel'} />
                </StyledSideTittel>

                <AlertStripe
                    inline={false}
                    variant={'error'}
                    children={<SpråkTekst id={'felles.modal.deployfeil.error'} />}
                />
                <StyledNormalTekst>
                    <SpråkTekst id={'felles.modal.deployfeil.info'} />
                </StyledNormalTekst>

                <StyledButton onClick={refresh}>
                    <SpråkTekst id={'felles.modal.deployfeil.knapp'} />
                </StyledButton>
            </ModalContent>
        </Modal>
    );
};

export default ModellVersjonModal;
