import React from 'react';

import { createRoot } from 'react-dom/client';

import { Box, VStack } from '@navikt/ds-react';

import { DisabledApp } from './components/Disabled/DisabledApp';
import { hentDekorator } from './decorator';

import '@navikt/ds-css';

hentDekorator();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Box marginBlock="10 16">
            <VStack gap="10">
                <DisabledApp />
            </VStack>
        </Box>
    </React.StrictMode>
);
