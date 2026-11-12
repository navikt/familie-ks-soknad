import { describe, expect, test } from 'vitest';

import { NETTVERKSFEIL_LOGGET_AV_DEKORATØREN } from './apm';

describe('NETTVERKSFEIL_LOGGET_AV_DEKORATØREN', () => {
    test.each([
        'console.error: [ERROR] Failed to renew session. {"error":"TypeError: Failed to fetch"}',
        'console.error: [ERROR] Failed to fetch session. {"error":"TypeError: Load failed"}',
        'console.error: [ERROR] Failed to fetch auth data. {"error":"TypeError: NetworkError when attempting to fetch resource."}',
        'console.error: [ERROR] Failed to refresh content for main-menu {"error":"TypeError: Failed to fetch","url":"https://www.nav.no/dekoratoren/main-menu"}',
    ])('matcher nettverksfeil logget av dekoratøren: %s', melding => {
        expect(NETTVERKSFEIL_LOGGET_AV_DEKORATØREN.test(melding)).toBe(true);
    });

    test.each([
        'console.error: [ERROR] Failed to hydrate decorator (CSR) {"error":"Error: No elem:header. See github.com/navikt/nav-dekoratoren"}',
        'console.error: [ERROR] Failed to fetch auth data. {"error":"HttpError: HTTP 503 Service Unavailable (https://www.nav.no/dekoratoren/auth)"}',
        'console.error: [ERROR] Failed to fetch auth data. {"error":"TimeoutError: Request timed out after 60000ms"}',
        'console.error: [ERROR] Failed to fetch header {"error":"TypeError: Failed to fetch dynamically imported module: https://cdn.nav.no/x.js"}',
        'console.error: [ERROR] Decorator data not available. Make sure decorator is loaded correctly. ',
        'console.error: Innsending feilet {"error":"TypeError: Failed to fetch"}',
        'Innsending feilet: console.error: [ERROR] Failed to renew session. {"error":"TypeError: Failed to fetch"}',
        'Failed to fetch',
    ])('matcher ikke andre feil: %s', melding => {
        expect(NETTVERKSFEIL_LOGGET_AV_DEKORATØREN.test(melding)).toBe(false);
    });
});
