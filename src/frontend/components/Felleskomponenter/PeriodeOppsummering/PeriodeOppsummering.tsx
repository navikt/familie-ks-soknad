import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Element } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { NavdsSemanticColorBorder } from '@navikt/ds-tokens/dist/tokens';

import { LocaleRecordBlock, Typografi } from '../../../typer/common';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import TekstBlock from '../TekstBlock';

const PeriodeContainer = styled.div<{ bottomBorder: boolean }>`
    margin: 2rem 0;
    border-bottom: ${props =>
        props.bottomBorder ? `1px solid ${NavdsSemanticColorBorder}` : 'none'};
`;

const StyledButton = styled(Button)`
    && {
        margin-bottom: 1.5rem;
    }
`;

const PeriodeTittel = styled.div`
    && {
        margin-bottom: 1.125rem;
    }
`;

const PeriodeOppsummering: React.FC<{
    nummer?: number;
    fjernPeriodeCallback?: () => void;
    fjernKnappSpråkId?: string;
    fjernKnappTekst?: LocaleRecordBlock;
    tittelSpråkId?: string;
    tittel?: LocaleRecordBlock;
    antall?: string;
    vedleggNotis?: ReactNode;
}> = ({
    nummer,
    fjernPeriodeCallback = undefined,
    fjernKnappSpråkId,
    fjernKnappTekst,
    tittelSpråkId,
    tittel,
    antall,
    vedleggNotis,
    children,
}) => {
    const skalHaBottomBorder = !!fjernPeriodeCallback;

    return (
        <PeriodeContainer bottomBorder={skalHaBottomBorder}>
            <PeriodeTittel>
                {tittelSpråkId && nummer && (
                    <Element>
                        <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />
                    </Element>
                )}
                {tittel && antall && (
                    <TekstBlock
                        block={tittel}
                        flettefelter={{ antall }}
                        typografi={Typografi.Label}
                    />
                )}
            </PeriodeTittel>
            {children}
            {fjernPeriodeCallback !== undefined && (
                <StyledButton
                    type={'button'}
                    variant={'tertiary'}
                    onClick={() => fjernPeriodeCallback()}
                >
                    <DeleteFilled />
                    {fjernKnappTekst && <TekstBlock block={fjernKnappTekst} />}
                    {fjernKnappSpråkId && <SpråkTekst id={fjernKnappSpråkId} />}
                </StyledButton>
            )}
            {vedleggNotis}
        </PeriodeContainer>
    );
};

export default PeriodeOppsummering;
