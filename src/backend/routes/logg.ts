import express, { type Express, type NextFunction, type Request, type Response } from 'express';

import { BASE_PATH } from '../../common/miljø.js';
import { FrontendLogg } from '../frontendLogg.js';
import { logger } from '../logger.js';
import { LoggSanitizer } from '../loggSanitizer.js';
import { addCallId } from '../middlewares/proxy.js';

const sanitizer = new LoggSanitizer();

export const konfigurerLogg = (app: Express): Express => {
    app.post(`${BASE_PATH}logg`, addCallId(), express.json({ limit: '32kb' }), (req: Request, res: Response) => {
        const logg = FrontendLogg.fraBody(req.body);
        if (!logg) {
            logger.warn('Ugyldig logg-payload mottatt fra frontend (droppet)');
            return res.sendStatus(400);
        }

        const { nivå, meta, melding } = FrontendLogg.tilLoggpost(logg, sanitizer, req.header('nav-call-id'));
        logger[nivå](meta, melding);
        return res.sendStatus(204);
    });

    // Logg-endepunktet skal aldri henge klienten: fang parse-/størrelsesfeil fra body-parser og svar
    // med 413 for stor body, 400 for ugyldig JSON.
    app.use(`${BASE_PATH}logg`, (feil: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (res.headersSent) {
            return;
        }
        const status = (feil as { status?: number; statusCode?: number }).status ?? 400;
        logger.warn('Kunne ikke lese logg-payload fra frontend (droppet)');
        res.sendStatus(status);
    });

    return app;
};
