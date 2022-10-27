import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';

import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { Button, Modal } from '@navikt/ds-react';

import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledUndertittel = styled(Undertittel)`
    padding-bottom: 1rem;
`;

const Flex = styled.div`
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
`;
const StyledLenke = styled(Lenke)`
    margin-right: 1rem;
`;

const BlokkerTilbakeKnappModal = () => {
    const [show, setShow] = useState(false);
    const { formatMessage } = useIntl();

    const håndterNavigasjon = () => {
        setShow(true);
        return false;
    };
    const håndterAvbryt = () => {
        setShow(false);
    };

    return (
        <>
            <Prompt message={håndterNavigasjon} />
            <Modal
                onClose={() => setShow(false)}
                open={show}
                aria-label={formatMessage({ id: 'felles.blokkerTilbakeKnapp.modal.tittel' })}
            >
                <ModalContent>
                    <StyledUndertittel>
                        <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tittel'} />
                    </StyledUndertittel>
                    <Normaltekst>
                        <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tekst'} />
                    </Normaltekst>
                    <Flex>
                        <StyledLenke href={'https://www.nav.no/person/dittnav/'}>
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tilDittNavKnapp'} />
                        </StyledLenke>
                        <Button onClick={håndterAvbryt}>
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.avbrytKnapp'} />
                        </Button>
                    </Flex>
                </ModalContent>
            </Modal>
        </>
    );
};

export default BlokkerTilbakeKnappModal;
