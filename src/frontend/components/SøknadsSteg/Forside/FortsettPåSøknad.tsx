import React, { FC } from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
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
`;

const ModalKnappeContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;

    @media all and ${device.mobile} {
        justify-content: center;
        flex-direction: column-reverse;
        max-width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
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
            >
                <ModalContent>
                    <TekstBlock block={startPaaNyttTittel} typografi={Typografi.ModalHeadingH1} />
                    <TekstBlock block={startPaaNyttInfo} typografi={Typografi.BodyShort} />
                    <ModalKnappeContainer>
                        <Button variant={'tertiary'} onClick={() => settVisStartPåNyttModal(false)}>
                            <TekstBlock block={startPaaNyttAvbryt} />
                        </Button>
                        <Button variant={'secondary'} onClick={startPåNytt}>
                            <TekstBlock block={startNySoeknadKnapp} />
                        </Button>
                    </ModalKnappeContainer>
                </ModalContent>
            </Modal>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;
