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

const PeriodeOppsummering: React.FC<{
    nummer: number;
    fjernPeriodeCallback?: () => void;
    /** @deprecated **/
    fjernKnappSpråkId?: string;
    fjernKnappTekst?: LocaleRecordBlock; //TODO fjerne optional når deprecated er fjernet
    /** @deprecated **/
    tittelSpråkId?: string;
    tittel?: LocaleRecordBlock; //TODO fjerne optional når deprecated er fjernet
    vedleggNotis?: ReactNode;
}> = ({
    nummer,
    fjernPeriodeCallback = undefined,
    fjernKnappSpråkId,
    fjernKnappTekst,
    tittelSpråkId,
    tittel,
    vedleggNotis,
    children,
}) => {
    const skalHaBottomBorder = !!fjernPeriodeCallback;

    return (
        <PeriodeContainer bottomBorder={skalHaBottomBorder}>
            {tittelSpråkId && (
                <Element>
                    <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />
                </Element>
            )}
            {tittel && (
                <TekstBlock
                    block={tittel}
                    flettefelter={{ antall: nummer.toString() }}
                    typografi={Typografi.PeriodeOppsummeringHeadingH2}
                />
            )}
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
