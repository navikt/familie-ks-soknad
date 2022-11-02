import React from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import AlertStripe from '../AlertStripe/AlertStripe';
import ModalContent from '../ModalContent';
import TekstBlock from '../TekstBlock';

const HovedinnholdContainer = styled.div`
    margin: 2.5rem 0;
`;

const StyledButton = styled(Button)`
    && {
        width: fit-content;
    }
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { tekster, plainTekst } = useApp();

    const mistetInformasjonenDinTekster = tekster().FELLES.modaler.mistetInformasjonenDin;

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            aria-label={plainTekst(mistetInformasjonenDinTekster.tittel)}
            onClose={refresh}
        >
            <ModalContent>
                <TekstBlock
                    block={mistetInformasjonenDinTekster.tittel}
                    typografi={Typografi.ModalHeadingH1}
                />

                <AlertStripe
                    inline={false}
                    variant={'error'}
                    children={plainTekst(mistetInformasjonenDinTekster.tittel)}
                />

                <HovedinnholdContainer>
                    <TekstBlock
                        block={mistetInformasjonenDinTekster.info}
                        typografi={Typografi.BodyLong}
                    />
                </HovedinnholdContainer>

                <StyledButton onClick={refresh}>
                    <TekstBlock
                        block={mistetInformasjonenDinTekster.knapp}
                        typografi={Typografi.BodyShort}
                    />
                </StyledButton>
            </ModalContent>
        </Modal>
    );
};

export default ModellVersjonModal;
