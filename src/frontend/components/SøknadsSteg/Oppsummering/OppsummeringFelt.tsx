import { useAppContext } from '@context/AppContext';
import { FormSummary } from '@navikt/ds-react';
import { formaterSøknadsvar } from '@utils/språk';
import type { ReactNode } from 'react';

interface IOppsummeringsFeltProps {
    tittel?: ReactNode;
    søknadsvar?: ReactNode | null;
    children?: ReactNode;
}

export function OppsummeringFelt({ tittel, søknadsvar, children }: IOppsummeringsFeltProps) {
    const { plainTekst, tekster } = useAppContext();

    return (
        <FormSummary.Answer>
            {tittel && <FormSummary.Label>{tittel}</FormSummary.Label>}
            {(søknadsvar || children) && (
                <FormSummary.Value>
                    {søknadsvar
                        ? formaterSøknadsvar(søknadsvar, plainTekst, tekster().FELLES.frittståendeOrd)
                        : children}
                </FormSummary.Value>
            )}
        </FormSummary.Answer>
    );
}
