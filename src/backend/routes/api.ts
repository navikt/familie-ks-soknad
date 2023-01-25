import express, { Express, RequestHandler } from 'express';

import Miljø, { basePath, getEnv } from '../../shared-utils/Miljø';
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
    if (getEnv() !== 'localhost') {
        app.use(
            `${basePath}api`,
            addCallId(),
            attachToken('familie-baks-soknad-api'),
            createApiForwardingFunction(Miljø().soknadApiUrl, `${basePath}api`)
        );

        app.use(
            `${basePath}dokument`,
            addCallId(),
            attachToken('familie-dokument'),
            createApiForwardingFunction(Miljø().dokumentUrl, `${basePath}dokument`)
        );
    } else {
        app.use(
            `${basePath}api`,
            createApiForwardingFunction(Miljø().soknadApiUrl, `${basePath}api`)
        );

        app.use(
            `${basePath}dokument`,
            createApiForwardingFunction(Miljø().dokumentUrl, `${basePath}dokument`)
        );
    }

    return app;
};
