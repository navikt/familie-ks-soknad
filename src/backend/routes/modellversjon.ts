import { Express } from 'express';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { modellVersjon } from '../../shared-utils/modellversjon';
import { basePath } from '../environment';

export const konfigurerModellVersjonEndpoint = (app: Express): Express => {
    app.get(`${basePath}modellversjon`, (_, res) => res.send(byggSuksessRessurs(modellVersjon)));
    return app;
};
