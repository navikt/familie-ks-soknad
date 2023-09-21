import React from 'react';

import styled from 'styled-components';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { BarnetsId, LocaleRecordBlock } from '../../../../typer/common';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';

const StyledButton = styled(Button)`
    && {
        margin: 0.5rem 0 -1rem -0.75rem;
    }
`;

export const FjernBarnKnapp: React.FC<{
    barnId: BarnetsId;
    fjernBarnCallback: (ident: string) => void;
}> = ({ barnId, fjernBarnCallback }) => {
    const { tekster } = useApp();
    const knappetekst: LocaleRecordBlock =
        tekster()[ESanitySteg.FELLES].modaler.leggTilBarn.fjernKnapp;

    return (
        <StyledButton
            type={'button'}
            variant={'tertiary'}
            onClick={() => fjernBarnCallback(barnId)}
            data-testid={'fjern-barn-knapp'}
            icon={<TrashFillIcon aria-hidden />}
        >
            <TekstBlock block={knappetekst} />
        </StyledButton>
    );
};
