import React, { ReactNode } from 'react';

import { Box } from '@navikt/ds-react';

const PerioderContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Box padding="4" marginBlock="2 0" background="surface-subtle" borderRadius="medium">
            {children}
        </Box>
    );
};

export default PerioderContainer;
