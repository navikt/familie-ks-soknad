import { ClientRequest } from 'http';

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuid } from 'uuid';

import { logError, logSecure } from '@navikt/familie-logging';

import logger from '../logger';

const restream = (proxyReq: ClientRequest, req: Request, _res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const createApiForwardingFunction = (targetUrl: string, context: string): RequestHandler => {
    logger.info('TargetUrl: ' + targetUrl);
    return createProxyMiddleware(context, {
        changeOrigin: true,
        logLevel: 'info',
        target: targetUrl,
        secure: true,
        onProxyReq: restream,
        pathRewrite: (path: string) => {
            logger.info('Path rewrite: ' + path.replace(context, ''));
            return path.replace(context, '');
        },
        onError: (err: Error, req: Request, res: Response) => {
            logError('Feil under proxy til apiet, se i securelog');
            logSecure('Feil under proxy til apiet', { err, req, res });
        },
    });
};

export const addCallId = (): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.headers['nav-call-id'] = req.headers['x-correlation-id'] ?? uuid();
        next();
    };
};
