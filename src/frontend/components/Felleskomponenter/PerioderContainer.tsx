import React, { ReactNode } from 'react';

import { FormSummary } from '@navikt/ds-react';

interface IPerioderContainer {
    tittel: ReactNode;
    children?: ReactNode;
}

const PerioderContainer: React.FC<IPerioderContainer> = ({ tittel, children }) => {
    return (
        <FormSummary>
            <FormSummary.Header>{tittel}</FormSummary.Header>
            <FormSummary.Answers>{children}</FormSummary.Answers>
        </FormSummary>
    );
};

export default PerioderContainer;
