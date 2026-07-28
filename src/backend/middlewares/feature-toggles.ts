import { RequestHandler } from 'express';
import type { ViteDevServer } from 'vite';

import { EToggle } from '../../common/feature-toggles.js';
import { renderHtml } from '../utils/render-html.js';
import { isEnabled } from '../utils/unleash.js';

/**
 * Express-middleware som returnerer en feil-side hvis familie-ks-soknad.disable-soknad er skrudd på i unleash
 */
export const expressToggleInterceptor = (viteDevServer?: ViteDevServer): RequestHandler => {
    return (req, res, next) => {
        let skalRendreDisabledApp;
        if (process.env.FORCE_DISABLED) {
            skalRendreDisabledApp = true;
        } else {
            skalRendreDisabledApp = isEnabled(EToggle.KONTANTSTOTTE);
        }
        if (skalRendreDisabledApp) {
            renderHtml('disabled.html', viteDevServer, req, res, next);
        } else {
            next();
        }
    };
};
