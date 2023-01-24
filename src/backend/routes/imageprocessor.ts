import { Express, RequestHandler, raw } from 'express';
import sharp from 'sharp';

import { logError, logWarn } from '@navikt/familie-logging';

import { basePath } from '../../shared-utils/Miljø';
import { jwtValidationInterceptor } from '../middlewares/jwt-interceptor';

async function prosesser(bilde: Buffer): Promise<Buffer> {
    return sharp(bilde)
        .rotate()
        .resize(600, 1200, {
            fit: sharp.fit.inside,
        })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();
}

const bildeProsesseringHandler: RequestHandler = async (req, res) => {
    if (req.body === undefined) {
        logWarn('Mottok ingen data i bildeProsesseringHandler');
        res.sendStatus(400);
        return;
    }

    try {
        const jpeg = await prosesser(req.body);
        res.set('Content-Type', 'image/jpg');
        res.send(jpeg);
    } catch (reason) {
        logError('Feil under konvertering til jpeg', reason as Error);
        res.sendStatus(500);
    }
};

export const konfigurerBildeProsessering = (app: Express): Express => {
    const path = `${basePath}konverter`;
    const uploadOptions = {
        inflate: true,
        limit: '20Mb',
        type: '*/*',
    };

    app.use(path, raw(uploadOptions) as RequestHandler);
    app.use(path, jwtValidationInterceptor);
    app.post(path, bildeProsesseringHandler);

    return app;
};
