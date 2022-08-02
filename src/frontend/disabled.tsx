import React from 'react';

import ReactDOM from 'react-dom';

import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import * as engelsk from './assets/lang/en.json' assert { type: 'json' };
import * as bokmål from './assets/lang/nb.json' assert { type: 'json' };
import * as nynorsk from './assets/lang/nn.json' assert { type: 'json' };
import { DisabledApp } from './components/Disabled/DisabledApp';
import InnholdContainer from './components/Felleskomponenter/InnholdContainer/InnholdContainer';
import { GlobalStyle } from './Theme';
import './index.less';

ReactDOM.render(
    <React.StrictMode>
        <InnholdContainer>
            <GlobalStyle />
            <SprakProvider
                tekster={{ nb: { ...bokmål }, nn: { ...nynorsk }, en: { ...engelsk } }}
                defaultLocale={LocaleType.nb}
            >
                <DisabledApp />
            </SprakProvider>
        </InnholdContainer>
    </React.StrictMode>,
    document.getElementById('root')
);
