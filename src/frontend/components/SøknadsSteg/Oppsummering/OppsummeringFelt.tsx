import React, { ReactNode } from 'react';

import { FormSummary } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { formaterSøknadsvar } from '../../../utils/språk';

interface IOppsummeringsFeltProps {
    tittel?: ReactNode;
    søknadsvar?: ReactNode | null;
    children?: ReactNode;
}

export function OppsummeringFelt({ tittel, søknadsvar, children }: IOppsummeringsFeltProps) {
    const { plainTekst, tekster } = useApp();

    return (
        <FormSummary.Answer>
            <FormSummary.Label>
                {tittel && <FormSummary.Label>{tittel}</FormSummary.Label>}
            </FormSummary.Label>
            <FormSummary.Value>
                {søknadsvar
                    ? formaterSøknadsvar(søknadsvar, plainTekst, tekster().FELLES.frittståendeOrd)
                    : children}
            </FormSummary.Value>
        </FormSummary.Answer>
    );
}
