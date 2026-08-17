import { Box, VStack } from '@navikt/ds-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { DisabledApp } from './components/Disabled/DisabledApp';
import { hentDekorator } from './decorator';

import '@navikt/ds-css';

hentDekorator();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <StrictMode>
        <Box marginBlock="space-40 space-64">
            <VStack gap="space-40">
                <DisabledApp />
            </VStack>
        </Box>
    </StrictMode>
);
