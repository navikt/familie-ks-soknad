import express, { Express, RequestHandler } from 'express';

import Miljø, { basePath } from '../../shared-utils/Miljø';
import { erklaeringInterceptor } from '../middlewares/erklaering-interceptor';
import { escapeBody } from '../middlewares/escape';
import { modellVersjonInterceptor } from '../middlewares/modell-versjon-interceptor';
import { addCallId, doProxy } from '../middlewares/proxy';
import attachToken from '../middlewares/tokenProxy';

export const konfigurerApi = (app: Express): Express => {
    // Sett opp middleware for input-sanitering
    app.use(`${basePath}api/soknad`, modellVersjonInterceptor);
    app.use(`${basePath}api/soknad`, express.json({ limit: '5mb' }) as RequestHandler);
    app.use(`${basePath}api/soknad`, erklaeringInterceptor);
    app.use(`${basePath}api/soknad`, escapeBody);
    app.use(
        `${basePath}api`,
        addCallId(),
        attachToken('familie-baks-soknad-api'),
        doProxy(Miljø().soknadApiUrl, `${basePath}api`)
    );

    app.use(
        `${basePath}dokument`,
        addCallId(),
        attachToken('familie-dokument'),
        doProxy(Miljø().dokumentUrl, `${basePath}dokument`)
    );

    return app;
};
