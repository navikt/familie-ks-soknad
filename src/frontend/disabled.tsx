import React from 'react';

import ReactDOM from 'react-dom';

import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { DisabledApp } from './components/Disabled/DisabledApp';
import InnholdContainer from './components/Felleskomponenter/InnholdContainer/InnholdContainer';
import { GlobalStyle } from './Theme';
import './index.less';

ReactDOM.render(
    <React.StrictMode>
        <InnholdContainer>
            <GlobalStyle />
            <SprakProvider defaultLocale={LocaleType.nb}>
                <DisabledApp />
            </SprakProvider>
        </InnholdContainer>
    </React.StrictMode>,
    document.getElementById('root')
);
