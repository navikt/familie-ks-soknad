import React, { ReactNode } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';

interface Props {
    className?: string;
    children?: ReactNode;
}

function InnholdContainer({ className, children }: Props) {
    const { tekster, plainTekst } = useApp();
    const forsidetekster = tekster().FORSIDE;

    return (
        <Box marginBlock="4 16" className={className}>
            <VStack gap="8">
                <Heading level="1" size="xlarge">
                    {plainTekst(forsidetekster.soeknadstittel)}
                </Heading>
                {children}
            </VStack>
        </Box>
    );
}

export default InnholdContainer;
