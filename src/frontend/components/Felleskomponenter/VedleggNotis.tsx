import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { FileContent } from '@navikt/ds-icons';

import { useApp } from '../../context/AppContext';
import { LocaleRecordString } from '../../typer/common';
import SpråkTekst from './SpråkTekst/SpråkTekst';

const NotisWrapper = styled.div`
    display: flex;
    margin-top: 1rem;
`;

const StyledFileContent = styled(FileContent)`
    max-width: 1.125rem;
    min-width: 1.125rem;
    max-height: fit-content;
    margin-right: 1rem;
    margin-top: 0.2rem;
`;

const NotisInnhold = styled.div`
    ul {
        margin: 0;
        padding-left: 1.3rem; // For kulepunkt
    }

    p {
        margin: 0;
    }
`;

export const VedleggNotis: React.FC<{
    språkTekstId?: string;
    dynamisk?: boolean;
    språkValues?: Record<string, ReactNode>;
    vedleggsTekst?: LocaleRecordString;
}> = ({ språkTekstId, dynamisk = false, språkValues = {}, vedleggsTekst }) => {
    const { localeString } = useApp();
    return (
        <NotisWrapper aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledFileContent role={'img'} focusable={false} aria-label={'vedleggsikon'} />
            <NotisInnhold>
                {språkTekstId && (
                    <Normaltekst>
                        <SpråkTekst id={språkTekstId} values={språkValues} />
                    </Normaltekst>
                )}
                {vedleggsTekst && localeString(vedleggsTekst)}
            </NotisInnhold>
        </NotisWrapper>
    );
};
