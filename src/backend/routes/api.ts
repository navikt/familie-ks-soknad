import express, { Express, RequestHandler } from 'express';

import { basePath } from '../environment';
import { erklaeringInterceptor } from '../middlewares/erklaering-interceptor';
import { escapeBody } from '../middlewares/escape';
import { modellVersjonInterceptor } from '../middlewares/modell-versjon-interceptor';
import { createApiForwardingFunction } from '../middlewares/proxy';

export const konfigurerApi = (app: Express): Express => {
    // Sett opp middleware for input-sanitering
    app.use(`${basePath}api/soknad`, modellVersjonInterceptor);
    app.use(`${basePath}api/soknad`, express.json({ limit: '5mb' }) as RequestHandler);
    app.use(`${basePath}api/soknad`, erklaeringInterceptor);
    app.use(`${basePath}api/soknad`, escapeBody);
    app.use(`${basePath}api`, createApiForwardingFunction());

    return app;
};
