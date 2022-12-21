import React from 'react';

import ReactDOM from 'react-dom';

import { DisabledApp } from './components/Disabled/DisabledApp';
import FellesWrapper from './FellesWrapper';
import './index.less';

ReactDOM.render(
    <FellesWrapper>
        <DisabledApp />
    </FellesWrapper>,
    document.getElementById('root')
);
