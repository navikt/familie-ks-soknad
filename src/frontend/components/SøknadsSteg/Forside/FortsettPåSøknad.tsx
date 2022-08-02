import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { Button } from '@navikt/ds-react';

import { device } from '../../../Theme';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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

const StyledSideTittel = styled(Sidetittel)`
    && {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
`;

const FortsettPåSøknad: FC = () => {
    const { fortsettPåSøknaden, startPåNytt, visStartPåNyttModal, settVisStartPåNyttModal } =
        useBekreftelseOgStartSoknad();
    const { formatMessage } = useIntl();
    return (
        <StyledFortsettPåSøknad role={'navigation'}>
            <KomponentGruppe>
                <AlertStripeInfo>
                    <Normaltekst>
                        <SpråkTekst id={'mellomlagring.info'} />
                    </Normaltekst>
                </AlertStripeInfo>
            </KomponentGruppe>
            <StyledButton onClick={fortsettPåSøknaden}>
                <SpråkTekst id={'mellomlagring.knapp.fortsett'} />
            </StyledButton>
            <StyledButton variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                <SpråkTekst id={'mellomlagring.knapp.startpånytt'} />
            </StyledButton>
            <Modal
                isOpen={visStartPåNyttModal}
                contentLabel={formatMessage({ id: 'felles.startpånytt.modal.startpånyttknapp' })}
                onRequestClose={() => {
                    settVisStartPåNyttModal(false);
                }}
            >
                <ModalInnholdContainer>
                    <StyledSideTittel>
                        <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                    </StyledSideTittel>
                    <Normaltekst>
                        <SpråkTekst id={'felles.startpånytt.modal.tekst'} />
                    </Normaltekst>
                    <ModalKnappeContainer>
                        <Button variant={'tertiary'} onClick={() => settVisStartPåNyttModal(false)}>
                            <SpråkTekst id={'felles.startpånytt.modal.avbrytknapp'} />
                        </Button>
                        <Button variant={'secondary'} onClick={startPåNytt}>
                            <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                        </Button>
                    </ModalKnappeContainer>
                </ModalInnholdContainer>
            </Modal>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;
