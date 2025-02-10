import React from 'react';

import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { awaitDecoratorData } from '@navikt/nav-dekoratoren-moduler';

import App from './App';
import { hentDekorator } from './decorator';
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

hentDekorator();

polyfillLocaledata().then(async () => {
    initSentry();
    initGrafanaFaro();

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    await awaitDecoratorData();

    const container = document.getElementById('root');

    const root = createRoot(container!);
    root.render(
        <FellesWrapper>
            <App />
        </FellesWrapper>
    );
});
