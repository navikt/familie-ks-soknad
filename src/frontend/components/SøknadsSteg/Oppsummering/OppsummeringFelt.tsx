import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { jaNeiSvarTilSpråkId } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledOppsummeringsFelt = styled.div`
    margin-bottom: 1rem;
`;

interface IOppsummeringsFeltProps {
    tittel?: ReactNode;
    søknadsvar?: string | null;
}

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.3rem;
    }
`;

export const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({
    tittel,
    søknadsvar,
    children,
}) => {
    let språktekstid: boolean | string = false;
    if (søknadsvar && søknadsvar in ESvar) {
        språktekstid = jaNeiSvarTilSpråkId(søknadsvar as ESvar);
    } else if (søknadsvar && søknadsvar in ESivilstand) {
        språktekstid = 'felles.sivilstatus.kode.' + søknadsvar;
    }

    return (
        <StyledOppsummeringsFelt>
            {tittel && <StyledElement>{tittel}</StyledElement>}
            {søknadsvar ? (
                <Normaltekst>
                    {språktekstid ? <SpråkTekst id={språktekstid} /> : søknadsvar}
                </Normaltekst>
            ) : (
                children
            )}
        </StyledOppsummeringsFelt>
    );
};
