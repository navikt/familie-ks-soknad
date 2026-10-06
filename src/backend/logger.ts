import { logger } from '@navikt/pino-logger';
import type { Request } from 'express';

export type LoggNivå = 'error' | 'warn' | 'info' | 'debug' | 'trace';

const prefix = (req: Request) => {
    return `${req.method} - ${req.originalUrl}`;
};

export const logRequest = (req: Request, message: string, nivå: LoggNivå, error?: unknown) => {
    const melding = `${prefix(req)}: ${message}`;
    const callId = req.header('nav-call-id');
    const requestId = req.header('x-request-id');

    const meta = {
        ...(callId ? { x_callId: callId } : {}),
        ...(requestId ? { x_requestId: requestId } : {}),
        ...(error ? { err: error } : {}),
    };

    logger[nivå](meta, melding);
};

export { logger };
