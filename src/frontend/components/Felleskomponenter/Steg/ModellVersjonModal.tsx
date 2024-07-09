import React from 'react';

import styled from 'styled-components';

import { Alert, Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

const HovedinnholdContainer = styled.div`
    margin: 2.5rem 0;
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { tekster, plainTekst } = useApp();

    const mistetInformasjonenDinTekster = tekster().FELLES.modaler.mistetInformasjonenDin;

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            onClose={refresh}
            header={{
                heading: plainTekst(mistetInformasjonenDinTekster.tittel),
                size: 'medium',
            }}
        >
            <ModalContent>
                <Alert
                    variant={'error'}
                    children={plainTekst(mistetInformasjonenDinTekster.tittel)}
                />

                <HovedinnholdContainer>
                    <TekstBlock
                        block={mistetInformasjonenDinTekster.info}
                        typografi={Typografi.BodyLong}
                    />
                </HovedinnholdContainer>
            </ModalContent>
            <Modal.Footer>
                <Button onClick={refresh}>
                    <TekstBlock
                        block={mistetInformasjonenDinTekster.knapp}
                        typografi={Typografi.BodyShort}
                    />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModellVersjonModal;
