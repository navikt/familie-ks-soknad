import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { logInfo } from '@navikt/familie-logging';

import { cspString } from '../csp';
import Miljø, { basePath } from '../shared-utils/Miljø';
import { expressToggleInterceptor } from './middlewares/feature-toggles';
import { konfigurerIndex, konfigurerIndexFallback } from './routes';
import { konfigurerApi } from './routes/api';
import { konfigurerAllFeatureTogglesEndpoint } from './routes/feature-toggles';
import { konfigurerBildeProsessering } from './routes/imageprocessor';
import { konfigurerModellVersjonEndpoint } from './routes/modellversjon';
import { konfigurerNais } from './routes/nais';
import { konfigurerStatic } from './routes/static';

dotenv.config();
const app = express();

app.disable('x-powered-by');

// webpack serve kjører på en annen port enn oss, må tillate det som origin
process.env.NODE_ENV === 'development' &&
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        })
    );

// Alltid bruk gzip-compression på alt vi server med express
app.use(compression());

// Parse cookies, bl.a. for rendring av lang-attribute
app.use(cookieParser());

konfigurerStatic(app);

// Middleware for unleash kill-switch
app.use(expressToggleInterceptor);

app.use((_req, res, next) => {
    res.header(
        'Content-Security-Policy',
        cspString(process.env.DEKORATOREN_URL ?? 'https://www.nav.no/dekoratoren')
    );
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    next();
});

konfigurerIndex(app);
konfigurerNais(app);
konfigurerApi(app);
konfigurerBildeProsessering(app);
konfigurerAllFeatureTogglesEndpoint(app);
konfigurerModellVersjonEndpoint(app);

konfigurerIndexFallback(app);

logInfo(`Starting server on localhost: http://localhost:${Miljø().port}${basePath}`);

app.listen(Miljø().port);
