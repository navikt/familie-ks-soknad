import type { Express, RequestHandler } from 'express';
import type { ViteDevServer } from 'vite';

import { renderHtml } from '../utils/render-html.js';

const indexHandler = (viteDevServer?: ViteDevServer): RequestHandler => {
    return async (req, res, next) => {
        renderHtml('index.html', viteDevServer, req, res, next);
    };
};

export const konfigurerIndex = (app: Express, viteDevServer?: ViteDevServer): Express => {
    app.get('/', indexHandler(viteDevServer));
    return app;
};

export const konfigurerIndexFallback = (app: Express, viteDevServer?: ViteDevServer): Express => {
    // Fallback, alt vi ikke treffer med andre handlere returnerer index.html
    app.get('*splat', indexHandler(viteDevServer));
    return app;
};
