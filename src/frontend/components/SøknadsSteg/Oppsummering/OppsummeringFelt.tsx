import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Element } from 'nav-frontend-typografi';

import { BodyLong, Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/common';
import { ESivilstand, FlettefeltVerdier } from '../../../typer/kontrakt/generelle';
import { jaNeiSvarTilSpråkId } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledOppsummeringsFelt = styled.div`
    margin-bottom: 1rem;
`;

interface IOppsummeringsFeltProps {
    /** @deprecated **/
    tittel?: ReactNode;
    spørsmålstekst?: LocaleRecordBlock | LocaleRecordString; // todo fjern nullable når tittel er fjernet;
    søknadsvar?: ReactNode | null;
    flettefelter?: FlettefeltVerdier;
}

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.3rem;
    }
`;

export const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({
    tittel,
    søknadsvar,
    spørsmålstekst,
    flettefelter,
    children,
}) => {
    const { plainTekst } = useApp();
    let språktekstid: boolean | string = false;
    if (typeof søknadsvar === 'string' && søknadsvar in ESvar) {
        språktekstid = jaNeiSvarTilSpråkId(søknadsvar as ESvar);
    } else if (typeof søknadsvar === 'string' && søknadsvar in ESivilstand) {
        språktekstid = 'felles.sivilstatus.kode.' + søknadsvar;
    }

    return (
        <StyledOppsummeringsFelt>
            {tittel && <StyledElement>{tittel}</StyledElement>}
            {spørsmålstekst && <Label>{plainTekst(spørsmålstekst, flettefelter)}</Label>}
            {søknadsvar ? (
                <BodyLong>{språktekstid ? <SpråkTekst id={språktekstid} /> : søknadsvar}</BodyLong>
            ) : (
                children
            )}
        </StyledOppsummeringsFelt>
    );
};
