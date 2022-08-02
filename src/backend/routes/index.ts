import { Express, RequestHandler } from 'express';

export const indexHandler: RequestHandler = async (req, res) => {
    const språk = req.cookies['decorator-language'];

    const hbsVariabler = {
        LOCALE_CODE: språk ?? 'nb',
    };

    res.render('index.html', hbsVariabler);
};

export const konfigurerIndex = (app: Express): Express => {
    app.get('/', indexHandler);
    return app;
};

export const konfigurerIndexFallback = (app: Express): Express => {
    // Fallback, alt vi ikke treffer med andre handlere returnerer index.html
    app.get('*', indexHandler);
    return app;
};

export default indexHandler;
