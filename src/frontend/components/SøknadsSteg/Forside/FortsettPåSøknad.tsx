import React, { FC } from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import ModalContent from '../../Felleskomponenter/ModalContent';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const StyledButton = styled(Button)`
    && {
        margin: 0 auto 2rem auto;
        padding: 1rem 3rem 1rem 3rem;
    }
`;

const StyledFortsettPåSøknad = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
`;

const FortsettPåSøknad: FC = () => {
    const { tekster, plainTekst } = useApp();
    const { fortsettPåSøknaden, startPåNytt, visStartPåNyttModal, settVisStartPåNyttModal } =
        useBekreftelseOgStartSoknad();

    const {
        FORSIDE: { mellomlagretAlert },
        FELLES: {
            navigasjon: { fortsettKnapp, startPaaNyttKnapp },
            modaler: {
                startPåNytt: {
                    startNySoeknadKnapp,
                    startPaaNyttInfo,
                    startPaaNyttTittel,
                    startPaaNyttAvbryt,
                },
            },
        },
    } = tekster();

    return (
        <StyledFortsettPåSøknad role={'navigation'}>
            <KomponentGruppe>
                <AlertStripe inline={false} variant={'info'}>
                    <TekstBlock block={mellomlagretAlert} typografi={Typografi.BodyShort} />
                </AlertStripe>
            </KomponentGruppe>
            <StyledButton onClick={fortsettPåSøknaden}>{plainTekst(fortsettKnapp)}</StyledButton>
            <StyledButton variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                {plainTekst(startPaaNyttKnapp)}
            </StyledButton>
            <Modal
                open={visStartPåNyttModal}
                onClose={() => {
                    settVisStartPåNyttModal(false);
                }}
                header={{
                    heading: plainTekst(startPaaNyttTittel),
                    size: 'medium',
                }}
            >
                <ModalContent>
                    <TekstBlock block={startPaaNyttInfo} typografi={Typografi.BodyShort} />
                </ModalContent>
                <Modal.Footer>
                    <Button variant={'primary'} onClick={startPåNytt}>
                        <TekstBlock block={startNySoeknadKnapp} />
                    </Button>
                    <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(false)}>
                        <TekstBlock block={startPaaNyttAvbryt} />
                    </Button>
                </Modal.Footer>
            </Modal>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;
