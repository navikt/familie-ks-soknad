import React from 'react';

import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import App from './App';
import FellesWrapper from './FellesWrapper';
import { LocaleType } from './typer/common';
import { initGrafanaFaro } from './utils/grafanaFaro';
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
    initGrafanaFaro();

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    const container = document.getElementById('root');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = createRoot(container!);
    root.render(
        <FellesWrapper>
            <App />
        </FellesWrapper>
    );
});
