import React, { useState } from 'react';

// import { Prompt } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

const Flex = styled.div`
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
`;

const BlokkerTilbakeKnappModal = () => {
    const [show, setShow] = useState(false);

    const { tekster } = useApp();
    const blokkerTilbakeknappTekster = tekster()[ESanitySteg.FELLES].modaler.blokkerTilbakeKnapp;

    // const håndterNavigasjon = () => {
    //     setShow(true);
    //     return false;
    // };
    const håndterAvbryt = () => {
        setShow(false);
    };

    return (
        <>
            {/*<Prompt message={håndterNavigasjon} />*/}
            <Modal onClose={() => setShow(false)} open={show}>
                <ModalContent>
                    <TekstBlock
                        block={blokkerTilbakeknappTekster.tittel}
                        typografi={Typografi.ModalHeadingH1}
                    />

                    <TekstBlock
                        block={blokkerTilbakeknappTekster.tekst}
                        typografi={Typografi.BodyLong}
                    />

                    <Flex>
                        <TekstBlock
                            block={blokkerTilbakeknappTekster.tilDittNav}
                            typografi={Typografi.BodyShort}
                        />
                        <Button onClick={håndterAvbryt}>
                            <TekstBlock
                                block={blokkerTilbakeknappTekster.avbryt}
                                typografi={Typografi.BodyShort}
                            />
                        </Button>
                    </Flex>
                </ModalContent>
            </Modal>
        </>
    );
};

export default BlokkerTilbakeKnappModal;
