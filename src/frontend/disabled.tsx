import React from 'react';

import ReactDOM from 'react-dom';

import { DisabledApp } from './components/Disabled/DisabledApp';
import { hentDekorator } from './decorator';
import FellesWrapper from './FellesWrapper';

hentDekorator();

ReactDOM.render(
    <FellesWrapper>
        <DisabledApp />
    </FellesWrapper>,
    document.getElementById('root')
);
