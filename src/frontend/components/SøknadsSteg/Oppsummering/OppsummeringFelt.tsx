import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { BodyLong, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { formaterSøknadsvar } from '../../../utils/språk';

const StyledOppsummeringsFelt = styled.div`
    margin-bottom: 1rem;
`;

interface IOppsummeringsFeltProps {
    spørsmålstekst: LocaleRecordBlock | LocaleRecordString;
    søknadsvar?: ReactNode | null;
    flettefelter?: FlettefeltVerdier;
}

export const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({
    søknadsvar,
    spørsmålstekst,
    flettefelter,
    children,
}) => {
    const { plainTekst, tekster } = useApp();

    return (
        <StyledOppsummeringsFelt>
            {spørsmålstekst && <Label>{plainTekst(spørsmålstekst, flettefelter)}</Label>}
            {søknadsvar ? (
                <BodyLong>
                    {formaterSøknadsvar(søknadsvar, plainTekst, tekster().FELLES.frittståendeOrd)}
                </BodyLong>
            ) : (
                children
            )}
        </StyledOppsummeringsFelt>
    );
};
