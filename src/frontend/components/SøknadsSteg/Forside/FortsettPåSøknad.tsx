import React, { FC } from 'react';

import styled from 'styled-components';

import { Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
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

const ModalInnholdContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    max-width: 35rem;
    > h1 {
        font-size: 1.25rem;
    }
`;

const ModalKnappeContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;

    > button {
        padding-top: 0;
        padding-bottom: 0;
    }

    @media all and ${device.mobile} {
        justify-content: center;
        flex-direction: column-reverse;
        max-width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
`;

const FortsettPåSøknad: FC = () => {
    const { tekster, localeString } = useApp();
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
                    <TekstBlock block={mellomlagretAlert} />
                </AlertStripe>
            </KomponentGruppe>
            <StyledButton onClick={fortsettPåSøknaden}>{localeString(fortsettKnapp)}</StyledButton>
            <StyledButton variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                {localeString(startPaaNyttKnapp)}
            </StyledButton>
            <Modal
                open={visStartPåNyttModal}
                onClose={() => {
                    settVisStartPåNyttModal(false);
                }}
            >
                <Modal.Content>
                    <ModalInnholdContainer>
                        <TekstBlock block={startPaaNyttTittel} />
                        <TekstBlock block={startPaaNyttInfo} />
                        <ModalKnappeContainer>
                            <Button
                                variant={'tertiary'}
                                onClick={() => settVisStartPåNyttModal(false)}
                            >
                                <TekstBlock block={startPaaNyttAvbryt} />
                            </Button>
                            <Button variant={'secondary'} onClick={startPåNytt}>
                                <TekstBlock block={startNySoeknadKnapp} />
                            </Button>
                        </ModalKnappeContainer>
                    </ModalInnholdContainer>
                </Modal.Content>
            </Modal>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;
