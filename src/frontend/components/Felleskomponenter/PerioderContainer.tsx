import { FormSummary } from '@navikt/ds-react';

import type { FC, ReactNode } from 'react';

interface IPerioderContainer {
    tittel: ReactNode;
    children?: ReactNode;
}

const PerioderContainer: FC<IPerioderContainer> = ({ tittel, children }) => {
    return (
        <FormSummary>
            <FormSummary.Header>{tittel}</FormSummary.Header>
            <FormSummary.Answers>{children}</FormSummary.Answers>
        </FormSummary>
    );
};

export default PerioderContainer;
