import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { device } from '../../../Theme';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
    const { tekster, localeString } = useApp();
    const { fortsettPåSøknaden, startPåNytt, visStartPåNyttModal, settVisStartPåNyttModal } =
        useBekreftelseOgStartSoknad();
    const { formatMessage } = useIntl();

    const {
        FORSIDE: { mellomlagretAlert },
        navigasjon: { fortsettKnapp, startPaaNyttKnapp },
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
