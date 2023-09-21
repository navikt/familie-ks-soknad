import React from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

const StyledModalFooter = styled(Modal.Footer)`
    align-items: center;
`;

const BlokkerTilbakeKnappModal = () => {
    const { visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal } = useAppNavigation();

    const { tekster } = useApp();
    const blokkerTilbakeknappTekster = tekster()[ESanitySteg.FELLES].modaler.blokkerTilbakeKnapp;

    const håndterAvbryt = () => {
        settVisBlokkerTilbakeKnappModal(false);
    };

    return (
        <Modal
            onClose={() => settVisBlokkerTilbakeKnappModal(false)}
            open={visBlokkerTilbakeKnappModal}
        >
            <Modal.Header>
                <TekstBlock
                    block={blokkerTilbakeknappTekster.tittel}
                    typografi={Typografi.ModalHeadingH1}
                />
            </Modal.Header>
            <ModalContent>
                <TekstBlock
                    block={blokkerTilbakeknappTekster.tekst}
                    typografi={Typografi.BodyLong}
                />
            </ModalContent>
            <StyledModalFooter>
                <Button onClick={håndterAvbryt}>
                    <TekstBlock
                        block={blokkerTilbakeknappTekster.avbryt}
                        typografi={Typografi.BodyShort}
                    />
                </Button>
                <TekstBlock
                    block={blokkerTilbakeknappTekster.tilDittNav}
                    typografi={Typografi.BodyShort}
                />
            </StyledModalFooter>
        </Modal>
    );
};

export default BlokkerTilbakeKnappModal;
