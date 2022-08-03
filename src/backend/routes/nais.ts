import { Express } from 'express';

export const konfigurerNais = (app: Express): Express => {
    app.get(/^\/(internal\/)?(isAlive|isReady)\/?$/, (_req, res) => res.sendStatus(200));
    return app;
};
