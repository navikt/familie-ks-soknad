import React from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { Typografi } from '../../../../typer/common';
import { ILeggTilBarnTekstinnhold } from '../../../../typer/sanity/modaler/leggTilBarn';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { StyledBarnekort } from '../Barnekort/Barnekort';
import { IVelgBarnTekstinnhold } from '../innholdTyper';

const StyledButton = styled(Button)`
    && {
        margin-top: 1rem;
        width: 100%;
        box-sizing: border-box;
    }
`;

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    const { tekster } = useApp();
    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];
    const teksterForLeggTilBarnModal: ILeggTilBarnTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;
    const { soekeForUregistrerteBarn } = teksterForSteg;

    return (
        <StyledBarnekort>
            <TekstBlock block={soekeForUregistrerteBarn} typografi={Typografi.BodyLong} />
            <StyledButton type={'button'} variant={'secondary'} onClick={() => onLeggTilBarn()}>
                <TekstBlock block={teksterForLeggTilBarnModal.leggTilKnapp} />
            </StyledButton>
        </StyledBarnekort>
    );
};
