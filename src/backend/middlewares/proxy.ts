import { ClientRequest } from 'http';

import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { logError, logSecure } from '@navikt/familie-logging';

import environment from '../environment';

const restream = (proxyReq: ClientRequest, req: Request, _res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

const apiPath = `^${process.env.BASE_PATH ?? '/'}api`;

export const createApiForwardingFunction = () => {
    return createProxyMiddleware(apiPath.replace('^', ''), {
        target: environment().apiUrl,
        changeOrigin: true,
        logLevel: process.env.ENV === 'prod' ? 'silent' : 'debug',
        secure: true,
        onProxyReq: restream,
        onError: (err: Error, req: Request, res: Response) => {
            logError('Feil under proxy til apiet, se i securelog');
            logSecure('Feil under proxy til apiet', { err, req, res });
        },
        pathRewrite: {
            [apiPath]: '/api',
        },
    });
};
