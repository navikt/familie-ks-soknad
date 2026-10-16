import type { Page, Request as PlaywrightRequest, Route } from '@playwright/test';
import { getResponse, type RequestHandler } from 'msw';

import { BASE_PATH } from '../src/common/miljø';
import { DEKORATØR_URL, svarMedDekoratørStub } from './dekoratør';

const API_PREFIKSER = ['api/', 'dokument/', 'modellversjon', 'toggles/', 'logg'].map(sti => `${BASE_PATH}${sti}`);

// Eksterne tjenester som appen kaller fra nettleseren, og som besvares av msw-handlers.
const MOCKEDE_EKSTERNE_ORIGINS = ['https://by26nl8j.apicdn.sanity.io'];
const TILLATTE_EKSTERNE_RESSURSER = ['https://cdn.nav.no/aksel/'];

export interface ApiMock {
    /**
     * Overstyrer svaret fra ett eller flere endepunkter i resten av testen, tilsvarende server.use() i vitest.
     *
     * De nye handlerne legges foran standardhandlerne. msw bruker den første handleren som matcher metode og URL, så en
     * handler for samme endepunkt vinner over standardhandleren. Endepunkter som ikke overstyres svarer som før.
     *
     * Overstyringen gjelder bare requester som sendes etter kallet, så kall `use` før `page.goto` eller handlingen som
     * utløser requesten. Hver test får sin egen `apiMock`, så overstyringer lekker ikke mellom tester.
     *
     * @example
     * apiMock.use(http.get(urlMedBasePath('api/innlogget/kontantstotte'), () => new HttpResponse(null, { status: 401 })));
     */
    use: (...handlers: RequestHandler[]) => void;
    /** Kall (`METODE url`) som ingen handler matchet. Fixturen feiler testen hvis listen ikke er tom. */
    ubehandledeKall: string[];
}

function skalMockes(url: URL, appOrigin: string): boolean {
    if (url.origin === appOrigin) {
        return API_PREFIKSER.some(prefiks => url.pathname.startsWith(prefiks));
    }
    return MOCKEDE_EKSTERNE_ORIGINS.includes(url.origin);
}

async function tilFetchRequest(request: PlaywrightRequest): Promise<Request> {
    const headers = Object.entries(await request.allHeaders()).filter(([navn]) => !navn.startsWith(':'));
    const body = request.postDataBuffer();

    return new Request(request.url(), {
        method: request.method(),
        headers,
        body: body && !['GET', 'HEAD'].includes(request.method()) ? new Uint8Array(body) : undefined,
    });
}

async function svarMedMock(route: Route, handlers: RequestHandler[], appOrigin: string, ubehandledeKall: string[]) {
    const request = route.request();
    const respons = await getResponse(handlers, await tilFetchRequest(request), { baseUrl: appOrigin });

    if (!respons) {
        const url = new URL(request.url());
        const kall = `${request.method()} ${url.origin === appOrigin ? '' : url.origin}${decodeURIComponent(url.pathname)}`;
        ubehandledeKall.push(kall);

        return route.fulfill({ status: 501, body: `Mangler mock-handler for ${kall}` });
    }

    return route.fulfill({
        status: respons.status,
        headers: Object.fromEntries(respons.headers),
        body: Buffer.from(await respons.arrayBuffer()),
    });
}

// index.html inneholder mustache-plassholdere som backenden vanligvis fyller ut (se src/backend/render-html.ts).
async function fyllUtIndexHtml(route: Route) {
    const respons = await route.fetch();
    const html = (await respons.text()).replace('{{LOCALE_CODE}}', 'nb').replace('{{{NAIS_META_TAGS}}}', '');

    return route.fulfill({ response: respons, body: html });
}

/**
 * Avskjærer alle requester fra siden:
 * - Kall mot backenden og Sanity besvares av msw-handlers. Kall uten handler registreres i `ubehandledeKall`.
 * - Dekoratøren erstattes av en stub, se `dekoratør.ts`.
 * - Kall til andre domener blokkeres (bortsett fra Aksel-fonter), slik at testene ikke er avhengige av eksterne tjenester.
 * - Øvrige requester (statiske filer fra vite preview) slippes gjennom.
 */
export async function settOppApiMock(
    page: Page,
    appOrigin: string,
    standardHandlers: RequestHandler[]
): Promise<ApiMock> {
    let handlers = [...standardHandlers];
    const ubehandledeKall: string[] = [];

    await page.route('**/*', async route => {
        const request = route.request();
        const url = new URL(request.url());

        if (skalMockes(url, appOrigin)) {
            return svarMedMock(route, handlers, appOrigin, ubehandledeKall);
        }
        if (url.origin === DEKORATØR_URL) {
            return svarMedDekoratørStub(route);
        }
        if (url.origin !== appOrigin) {
            const erTillatt = TILLATTE_EKSTERNE_RESSURSER.some(prefiks => url.href.startsWith(prefiks));
            return erTillatt ? route.fallback() : route.abort('blockedbyclient');
        }
        if (request.resourceType() === 'document') {
            return fyllUtIndexHtml(route);
        }
        return route.fallback();
    });

    return {
        use: (...nyeHandlere) => {
            handlers = [...nyeHandlere, ...handlers];
        },
        ubehandledeKall,
    };
}
