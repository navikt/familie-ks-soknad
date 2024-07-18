import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { LocaleRecordBlock } from '../../../typer/common';
import TekstBlock from '../TekstBlock';

interface Props {
    fjernPeriodeCallback?: () => void;
    fjernKnappTekst: LocaleRecordBlock;
    tittel: ReactNode;
    vedleggNotis?: ReactNode;
    children?: ReactNode;
}

const PeriodeContainer = styled.div<{ $bottomBorder: boolean }>`
    margin-bottom: 2rem;
    border-bottom: ${props => (props.$bottomBorder ? `1px solid ${ABorderDefault}` : 'none')};
`;

const StyledButton = styled(Button)`
    && {
        margin-bottom: 1.5rem;
    }
`;

function PeriodeOppsummering({
    fjernPeriodeCallback = undefined,
    fjernKnappTekst,
    tittel,
    vedleggNotis,
    children,
}: Props) {
    const skalHaBottomBorder = !!fjernPeriodeCallback;

    return (
        <PeriodeContainer $bottomBorder={skalHaBottomBorder}>
            {tittel}
            {children}
            {fjernPeriodeCallback !== undefined && (
                <StyledButton
                    type={'button'}
                    variant={'tertiary'}
                    onClick={() => fjernPeriodeCallback()}
                    icon={<TrashFillIcon aria-hidden />}
                >
                    {<TekstBlock block={fjernKnappTekst} />}
                </StyledButton>
            )}
            {vedleggNotis}
        </PeriodeContainer>
    );
}

export default PeriodeOppsummering;
