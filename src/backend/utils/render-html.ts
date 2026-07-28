import { NextFunction, Request, Response } from 'express';
import type { ViteDevServer } from 'vite';

/**
 * Rendrer en html-fil med mustache. Når vi kjører lokalt med ViteDevServer må resultatet i tillegg
 * transformeres av Vite for å injisere HMR-klient og løse %BASE_URL% og modul-importer.
 */
export const renderHtml = (
    htmlFilNavn: string,
    viteDevServer: ViteDevServer | undefined,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const språk: string | undefined = req.cookies['decorator-language'];
    req.app.render(htmlFilNavn, { LOCALE_CODE: språk ?? 'nb' }, async (feil: Error, html: string) => {
        if (feil) {
            return next(feil);
        }
        if (viteDevServer) {
            try {
                html = await viteDevServer.transformIndexHtml(req.originalUrl, html);
            } catch (transformFeil) {
                viteDevServer.ssrFixStacktrace(transformFeil as Error);
                return next(transformFeil);
            }
        }
        res.send(html);
    });
};
