import React, { ReactNode } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';

interface Props {
    className?: string;
    children?: ReactNode;
}

function InnholdContainer({ className, children }: Props) {
    const { tekster, plainTekst } = useAppContext();
    const forsidetekster = tekster().FORSIDE;

    return (
        <Box marginBlock="space-40 space-64" className={className}>
            <VStack gap="space-40">
                <Heading level="1" size="xlarge">
                    {plainTekst(forsidetekster.soeknadstittel)}
                </Heading>
                {children}
            </VStack>
        </Box>
    );
}

export default InnholdContainer;
