import React, { ReactNode } from 'react';

import { Box, Page, VStack } from '@navikt/ds-react';

interface Props {
    className?: string;
    children?: ReactNode;
}

function InnholdContainer({ className, children }: Props) {
    return (
        <Box marginBlock="4 16">
            <Page.Block width="text" gutters className={className}>
                <VStack gap="12">{children}</VStack>
            </Page.Block>
        </Box>
    );
}

export default InnholdContainer;
