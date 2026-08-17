import { byggSuksessRessurs } from '@navikt/familie-typer';
import type { Express } from 'express';

import { BASE_PATH } from '../../common/miljø.js';
import { modellVersjon } from '../../common/modellversjon.js';

export const konfigurerModellVersjonEndpoint = (app: Express): Express => {
    app.get(`${BASE_PATH}modellversjon`, (_, res) => {
        res.send(byggSuksessRessurs(modellVersjon));
    });
    return app;
};
