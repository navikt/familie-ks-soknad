import React from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { device } from '../../../Theme';
import { RouteEnum } from '../../../typer/routes';

const Container = styled.nav`
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        ' tilbake gåVidere '
        ' avbryt avbryt';
    grid-template-rows: auto;
    gap: 0.5rem;
    justify-content: center;

    @media all and ${device.mobile} {
        grid-template-columns: 1fr;
        grid-template-areas:
            ' gåVidere '
            ' tilbake '
            ' avbryt';
        padding: 2rem 0;
    }
`;

const StyledButton = styled(Button)<{
    placeself: 'end' | 'center' | 'start';
    gridarea: 'tilbake' | 'gåVidere' | 'avbryt';
}>`
    && {
        grid-area: ${props => props.gridarea};
        min-width: 12.5rem;
        place-self: ${props => props.placeself};
        @media all and ${device.mobile} {
            place-self: center;
        }
    }
`;

type Knappetype = 'primary' | 'secondary';

const Navigeringspanel: React.FC<{
    onAvbrytCallback: () => void;
    onTilbakeCallback: () => void;
    valideringErOk: (() => boolean) | undefined;
}> = ({ onAvbrytCallback, onTilbakeCallback, valideringErOk }) => {
    const { hentNesteSteg } = useSteg();
    const nesteSteg = hentNesteSteg();
    const { innsendingStatus, tekster, plainTekst } = useApp();

    const { avbrytSoeknad, tilbakeKnapp, gaaVidereKnapp, sendSoeknadKnapp } =
        tekster().FELLES.navigasjon;

    const hentKnappetype = (): Knappetype => {
        if (valideringErOk) {
            return valideringErOk() ? 'primary' : 'secondary';
        } else {
            return 'primary';
        }
    };

    return (
        <Container>
            <StyledButton
                variant={'secondary'}
                type={'button'}
                onClick={onTilbakeCallback}
                placeself={'end'}
                gridarea={'tilbake'}
            >
                {plainTekst(tilbakeKnapp)}
            </StyledButton>
            <StyledButton
                type={'submit'}
                variant={hentKnappetype()}
                placeself={'start'}
                gridarea={'gåVidere'}
                loading={innsendingStatus.status === RessursStatus.HENTER}
                data-testid={'gå-videre-knapp'}
            >
                {plainTekst(
                    nesteSteg.route === RouteEnum.Kvittering ? sendSoeknadKnapp : gaaVidereKnapp
                )}
            </StyledButton>

            <StyledButton
                variant={'tertiary'}
                type={'button'}
                onClick={onAvbrytCallback}
                gridarea={'avbryt'}
                placeself={'center'}
                margintop={'0'}
            >
                {plainTekst(avbrytSoeknad)}
            </StyledButton>
        </Container>
    );
};

export default Navigeringspanel;
