import express, { Express, RequestHandler } from 'express';

import Miljø from '../../frontend/Miljø';
import { basePath } from '../environment';
import { erklaeringInterceptor } from '../middlewares/erklaering-interceptor';
import { escapeBody } from '../middlewares/escape';
import { modellVersjonInterceptor } from '../middlewares/modell-versjon-interceptor';
import { addCallId, createApiForwardingFunction } from '../middlewares/proxy';
import attachToken from '../middlewares/tokenProxy';

export const konfigurerApi = (app: Express): Express => {
    // Sett opp middleware for input-sanitering
    app.use(`${basePath}api/soknad`, modellVersjonInterceptor);
    app.use(`${basePath}api/soknad`, express.json({ limit: '5mb' }) as RequestHandler);
    app.use(`${basePath}api/soknad`, erklaeringInterceptor);
    app.use(`${basePath}api/soknad`, escapeBody);
    app.use(
        `${process.env.BASE_PATH}/api`,
        addCallId(),
        attachToken('familie-baks-soknad-api'),
        createApiForwardingFunction(Miljø().soknadApi, `${process.env.BASE_PATH}/api`)
    );

    app.use(
        `${process.env.BASE_PATH}/dokument`,
        addCallId(),
        attachToken('familie-dokument'),
        createApiForwardingFunction(Miljø().dokumentUrl, `${process.env.BASE_PATH}/dokument`)
    );

    return app;
};
