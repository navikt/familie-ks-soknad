import type { Route } from '@playwright/test';

// Appen henter dekoratøren for dev når den ikke kjører i prod, se src/frontend/decorator.ts.
export const DEKORATØR_URL = 'https://dekoratoren.ekstern.dev.nav.no';

/**
 * Erstatter dekoratøren med en stub. Appen venter på `window.__DECORATOR_DATA__` og `window.webStorageController` før
 * den rendres (awaitDecoratorData), og `setParams` venter på at dekoratøren svarer på «ready». Stuben gir ikke samtykke
 * til noe, slik at for eksempel uxsignals ikke lastes.
 */
const DEKORATØR_STUB = `
window.__DECORATOR_DATA__ = { params: { language: 'nb', context: 'privatperson', simple: true } };
window.webStorageController = {
    isStorageKeyAllowed: () => false,
    getAllowedStorage: () => [],
    getCurrentConsent: () => ({
        consent: { analytics: false, surveys: false },
        userActionTaken: true,
        meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 },
    }),
};
window.addEventListener('message', ({ data }) => {
    if (data?.source === 'decoratorClient' && data?.event === 'ready') {
        window.postMessage({ source: 'decorator', event: 'ready' }, window.location.origin);
    }
});
`;

export function svarMedDekoratørStub(route: Route) {
    const erSkript = new URL(route.request().url()).pathname.endsWith('.js');

    return route.fulfill({
        contentType: erSkript ? 'text/javascript' : 'text/css',
        body: erSkript ? DEKORATØR_STUB : '',
    });
}
