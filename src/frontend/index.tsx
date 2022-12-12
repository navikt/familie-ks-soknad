import React from 'react';

import * as Sentry from '@sentry/react';
import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import './index.less';
import App from './App';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { logError } from './utils/amplitude';
import { initSentry } from './utils/sentry';
import '@navikt/ds-css';

const polyfillLocaledata = async () => {
    for (const locale in LocaleType) {
        // Last ned land-navn for statsborgeskap
        await import(
            /* webpackInclude: /(nb|nn|en)\.json/ */
            /* webpackChunkName: "localedata" */
            /* webpackMode: "lazy-once" */
            `i18n-iso-countries/langs/${locale}.json`
        ).then(result => registerLocale(result));
    }
};

polyfillLocaledata().then(() => {
    initSentry();

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    ReactDOM.render(
        <React.StrictMode>
            <SprakProvider defaultLocale={LocaleType.nb}>
                <HttpProvider>
                    <Sentry.ErrorBoundary
                        fallback={() => <Feilside />}
                        beforeCapture={scope => scope.setTag('scope', 'familie-ks-soknad')}
                        onError={logError}
                    >
                        <App />
                    </Sentry.ErrorBoundary>
                </HttpProvider>
            </SprakProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );
});
