import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import type { ViteDevServer } from 'vite';

import { logInfo } from '@navikt/familie-logging';

import miljø, { BASE_PATH, erLokalt } from '../common/miljø.js';

import { cspString } from './csp.js';
import { expressToggleInterceptor } from './middlewares/feature-toggles.js';
import { konfigurerApi } from './routes/api.js';
import { konfigurerAllFeatureTogglesEndpoint } from './routes/feature-toggles.js';
import { konfigurerIndex, konfigurerIndexFallback } from './routes/index.js';
import { konfigurerModellVersjonEndpoint } from './routes/modellversjon.js';
import { konfigurerNais } from './routes/nais.js';
import { konfigurerStatic } from './routes/static.js';
import { initializeUnleash } from './utils/unleash.js';

dotenv.config();

initializeUnleash();

const app = express();

app.disable('x-powered-by');

// Lokalt kjører vi Vite dev-serveren i middlewareMode, slik at frontend og backend
// serveres fra samme port og vi slipper CORS- og proxy-oppsett.
let viteDevServer: ViteDevServer | undefined;
if (erLokalt()) {
    // Modulnavnet legges i en variabel slik at TypeScript ikke gjør importen statisk. Vite
    // brukes kun lokalt, og utelates fra produksjonsbygget i
    // scripts/prune-backend-node-modules.js.
    const viteModulNavn = 'vite';
    const { createServer } = await import(viteModulNavn);
    viteDevServer = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });
}

// Alltid bruk gzip-compression på alt vi server med express
app.use(compression());

// Parse cookies, bl.a. for rendring av lang-attribute
app.use(cookieParser());

konfigurerStatic(app, viteDevServer);

// Middleware for unleash kill-switch
app.use(expressToggleInterceptor(viteDevServer));

app.use((_req, res, next) => {
    res.header('Content-Security-Policy', cspString(process.env.DEKORATOREN_URL ?? 'https://www.nav.no/dekoratoren'));
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    next();
});

konfigurerNais(app);
konfigurerApi(app);
konfigurerAllFeatureTogglesEndpoint(app);
konfigurerModellVersjonEndpoint(app);

// Vite sine middlewares serverer frontend-modulene lokalt, og må ligge etter API-rutene
// men før index-handlerne som ellers ville fanget alt med sin fallback.
if (viteDevServer) {
    app.use(viteDevServer.middlewares);
}

konfigurerIndex(app, viteDevServer);

konfigurerIndexFallback(app, viteDevServer);

logInfo(`Starting server on localhost: http://localhost:${miljø().port}${BASE_PATH}`);

app.listen(miljø().port);
