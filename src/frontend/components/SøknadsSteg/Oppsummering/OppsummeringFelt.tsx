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
    /*
    Tittel brukes istedenfor spørsmålstekst dersom man ønsker å vise tittel/spørsmål på en annen måte enn ved bruk av plainTekst, for eksempel ved å passere inn en <TekstBlock> komponent.
    I oppgaven om Oppsummering iht Aksel (lenke) så skal OppsummeringsFelt endres, da vil også problemet med å ha to props (spørsmålstekst og tittel) løses slik at vil fungere likt som det nå er i BA.
    */
    tittel?: ReactNode;
    spørsmålstekst?: LocaleRecordBlock | LocaleRecordString;
    søknadsvar?: ReactNode | null;
    flettefelter?: FlettefeltVerdier;
    children?: ReactNode;
}

export function OppsummeringFelt({
    tittel,
    søknadsvar,
    spørsmålstekst,
    flettefelter,
    children,
}: IOppsummeringsFeltProps) {
    const { plainTekst, tekster } = useApp();

    return (
        <StyledOppsummeringsFelt>
            {tittel ? (
                <Label>{tittel}</Label>
            ) : (
                spørsmålstekst && <Label>{plainTekst(spørsmålstekst, flettefelter)}</Label>
            )}
            {søknadsvar ? (
                <BodyLong>
                    {formaterSøknadsvar(søknadsvar, plainTekst, tekster().FELLES.frittståendeOrd)}
                </BodyLong>
            ) : (
                children
            )}
        </StyledOppsummeringsFelt>
    );
}
