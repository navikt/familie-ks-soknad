import type { Socket } from 'node:net';
import { logError, logSecure } from '@navikt/familie-logging';

import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuid } from 'uuid';

import { erLokalt } from '../../common/miljø.js';

import { AUTHORIZATION_HEADER } from './tokenProxy.js';

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
            error: (err: Error, req: Request, res: Response | Socket) => {
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
