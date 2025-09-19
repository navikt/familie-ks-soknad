import React, { ReactNode } from 'react';

import { Box, Label, BodyShort } from '@navikt/ds-react';

export const BarnekortInfo: React.FC<{ label: ReactNode; verdi: ReactNode }> = ({ label, verdi }) => {
    return (
        <Box>
            <Label as="p">{label}</Label>
            <BodyShort>{verdi}</BodyShort>
        </Box>
    );
};
