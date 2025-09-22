import express, { Express, RequestHandler } from 'express';

import miljø, { BASE_PATH } from '../../shared-utils/miljø';
import { erklaeringInterceptor } from '../middlewares/erklaering-interceptor';
import { escapeBody } from '../middlewares/escape';
import { modellVersjonInterceptor } from '../middlewares/modell-versjon-interceptor';
import { addCallId, doProxy } from '../middlewares/proxy';
import attachToken from '../middlewares/tokenProxy';

export const konfigurerApi = (app: Express): Express => {
    // Sett opp middleware for input-sanitering
    app.use(`${BASE_PATH}api/soknad`, modellVersjonInterceptor);
    app.use(`${BASE_PATH}api/soknad`, express.json({ limit: '5mb' }) as RequestHandler);
    app.use(`${BASE_PATH}api/soknad`, erklaeringInterceptor);
    app.use(`${BASE_PATH}api/soknad`, escapeBody);
    app.use(`${BASE_PATH}api`, addCallId(), attachToken('familie-baks-soknad-api'), doProxy(miljø().soknadApiUrl));

    app.use(`${BASE_PATH}dokument`, addCallId(), attachToken('familie-dokument'), doProxy(miljø().dokumentUrl));

    return app;
};
