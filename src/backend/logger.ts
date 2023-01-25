import { Request } from 'express';

import { LOG_LEVEL, logDebug, logError, logInfo, logWarn } from '@navikt/familie-logging';

const prefix = (req: Request) => {
    return `${req.method} - ${req.originalUrl}`;
};

export const logRequest = (req: Request, message: string, level: LOG_LEVEL, error?: unknown) => {
    const melding = `${prefix(req)}: ${message}`;
    const callId = req.header('nav-call-id');
    const requestId = req.header('x-request-id');

    const meta = {
        ...(callId ? { x_callId: callId } : {}),
        ...(requestId ? { x_requestId: requestId } : {}),
        ...(error ? { error: error } : {}),
    };
    switch (level) {
        case LOG_LEVEL.DEBUG:
            logDebug(melding, meta);
            break;
        case LOG_LEVEL.WARNING:
            logWarn(melding, meta);
            break;
        case LOG_LEVEL.ERROR:
            logError(melding, undefined, meta);
            break;
        case LOG_LEVEL.INFO:
        default:
            logInfo(melding, meta);
    }
};
