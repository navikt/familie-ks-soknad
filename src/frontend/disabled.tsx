import React from 'react';

import { createRoot } from 'react-dom/client';

import { DisabledApp } from './components/Disabled/DisabledApp';
import { hentDekorator } from './decorator';
import FellesWrapper from './FellesWrapper';

hentDekorator();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <FellesWrapper>
        <DisabledApp />
    </FellesWrapper>
);
