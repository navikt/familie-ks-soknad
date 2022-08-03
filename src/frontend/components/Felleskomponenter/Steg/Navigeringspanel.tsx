import React from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { device } from '../../../Theme';
import { RouteEnum } from '../../../typer/routes';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

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
        min-width: 10rem;
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
    const { innsendingStatus } = useApp();

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
                <SpråkTekst id={'felles.navigasjon.tilbake'} />
            </StyledButton>
            <StyledButton
                type={'submit'}
                variant={hentKnappetype()}
                placeself={'start'}
                gridarea={'gåVidere'}
                loading={innsendingStatus.status === RessursStatus.HENTER}
            >
                <SpråkTekst
                    id={
                        nesteSteg.route === RouteEnum.Kvittering
                            ? 'dokumentasjon.send-søknad.knapp'
                            : 'felles.navigasjon.gå-videre'
                    }
                />
            </StyledButton>

            <StyledButton
                variant={'tertiary'}
                type={'button'}
                onClick={onAvbrytCallback}
                gridarea={'avbryt'}
                placeself={'center'}
                margintop={'0'}
            >
                <SpråkTekst id={'felles.navigasjon.avbryt'} />
            </StyledButton>
        </Container>
    );
};

export default Navigeringspanel;
