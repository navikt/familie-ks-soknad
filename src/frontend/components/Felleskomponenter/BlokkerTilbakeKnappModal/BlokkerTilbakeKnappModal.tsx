import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';

import Lenke from 'nav-frontend-lenker';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { Button } from '@navikt/ds-react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledModal = styled(Modal)`
    max-width: 30rem;
`;
const StyledUndertittel = styled(Undertittel)`
    padding-bottom: 1rem;
`;
const Wrapper = styled.div`
    padding: 0.5rem;
`;
const Flex = styled.div`
    padding-top: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-content: space-between;
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
            <StyledModal
                onRequestClose={() => setShow(false)}
                isOpen={show}
                contentLabel={formatMessage({ id: 'felles.blokkerTilbakeKnapp.modal.tittel' })}
            >
                <Wrapper>
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
                </Wrapper>
            </StyledModal>
        </>
    );
};

export default BlokkerTilbakeKnappModal;
