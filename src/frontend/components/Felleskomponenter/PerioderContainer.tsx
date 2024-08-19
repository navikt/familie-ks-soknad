import React, { ReactNode } from 'react';

import { Box, FormSummary } from '@navikt/ds-react';

interface IPerioderContainer {
    // tittel: ReactNode;
    children?: ReactNode;
}

const PerioderContainer: React.FC<IPerioderContainer> = ({
    // tittel,
    children,
}) => {
    return (
        <Box marginBlock="4 0">
            <FormSummary>
                {/* <FormSummary.Header>{tittel}</FormSummary.Header> */}
                <FormSummary.Answers>{children}</FormSummary.Answers>
            </FormSummary>
        </Box>
    );
};

export default PerioderContainer;
