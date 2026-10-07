import { awaitDecoratorData } from '@navikt/nav-dekoratoren-moduler';
import type { LocaleData } from 'i18n-iso-countries';
import { registerLocale } from 'i18n-iso-countries';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { LocaleType } from '../common/typer/locale';

import App from './App';
import { hentDekorator } from './decorator';
import { initApm } from './utils/apm';
import { registerAxiosInterceptors } from './utils/interceptors';

import '@navikt/ds-css';
import './index.css';

// Statiske imports (i stedet for en dynamisk import med template literal) slik at
// vite kan analysere og bunte disse - en dynamisk sti kan ikke analyseres av vite.
const localeImporters: Record<LocaleType, () => Promise<{ default: LocaleData }>> = {
    [LocaleType.en]: () => import('i18n-iso-countries/langs/en.json'),
    [LocaleType.nb]: () => import('i18n-iso-countries/langs/nb.json'),
    [LocaleType.nn]: () => import('i18n-iso-countries/langs/nn.json'),
};

const polyfillLocaledata = async () => {
    for (const locale in LocaleType) {
        // Last ned land-navn for statsborgeskap
        await localeImporters[locale as LocaleType]().then(result => registerLocale(result.default));
    }
};

registerAxiosInterceptors();

hentDekorator();

polyfillLocaledata().then(async () => {
    initApm();

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    await awaitDecoratorData();

    const container = document.getElementById('root');

    const root = createRoot(container!);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
});
