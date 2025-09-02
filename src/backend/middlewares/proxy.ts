import { ClientRequest } from 'http';

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuid } from 'uuid';

import { logError, logSecure } from '@navikt/familie-logging';

import { erLokalt } from '../../shared-utils/miljø';

import { AUTHORIZATION_HEADER } from './tokenProxy';

const restream = (proxyReq: ClientRequest, req: Request, _res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (targetUrl: string): RequestHandler => {
    return createProxyMiddleware({
        changeOrigin: true,
        logger: console,
        target: targetUrl,
        secure: true,
        on: {
            proxyReq: restream,
            error: (err: Error, req: Request, res: Response) => {
                logError('Feil under proxy til apiet, se i securelog');
                logSecure('Feil under proxy til apiet', { err, req, res });
            },
        },
    });
};

export const addCallId = (): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.headers['nav-call-id'] = req.headers['x-correlation-id'] ?? uuid();
        next();
    };
};

export const fjernAutentiseringHeaderHvisLokalt = (): RequestHandler => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        if (erLokalt()) {
            req.headers[AUTHORIZATION_HEADER] = '';
        }
        next();
    };
};
