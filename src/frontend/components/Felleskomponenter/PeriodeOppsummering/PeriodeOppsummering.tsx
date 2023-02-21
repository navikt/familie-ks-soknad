import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { DeleteFilled } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { LocaleRecordBlock } from '../../../typer/common';
import TekstBlock from '../TekstBlock';

const PeriodeContainer = styled.div<{ bottomBorder: boolean }>`
    margin: 2rem 0;
    border-bottom: ${props => (props.bottomBorder ? `1px solid ${ABorderDefault}` : 'none')};
`;

const StyledButton = styled(Button)`
    && {
        margin-bottom: 1.5rem;
    }
`;

const PeriodeOppsummering: React.FC<{
    fjernPeriodeCallback?: () => void;
    fjernKnappTekst: LocaleRecordBlock;
    tittel: ReactNode;
    vedleggNotis?: ReactNode;
}> = ({ fjernPeriodeCallback = undefined, fjernKnappTekst, tittel, vedleggNotis, children }) => {
    const skalHaBottomBorder = !!fjernPeriodeCallback;

    return (
        <PeriodeContainer bottomBorder={skalHaBottomBorder}>
            {tittel}
            {children}
            {fjernPeriodeCallback !== undefined && (
                <StyledButton
                    type={'button'}
                    variant={'tertiary'}
                    onClick={() => fjernPeriodeCallback()}
                    icon={<DeleteFilled />}
                >
                    {<TekstBlock block={fjernKnappTekst} />}
                </StyledButton>
            )}
            {vedleggNotis}
        </PeriodeContainer>
    );
};

export default PeriodeOppsummering;
