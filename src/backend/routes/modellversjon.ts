import { Express } from 'express';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { BASE_PATH } from '../../shared-utils/miljø';
import { modellVersjon } from '../../shared-utils/modellversjon';

export const konfigurerModellVersjonEndpoint = (app: Express): Express => {
    app.get(`${BASE_PATH}modellversjon`, (_, res) => {
        res.send(byggSuksessRessurs(modellVersjon));
    });
    return app;
};
