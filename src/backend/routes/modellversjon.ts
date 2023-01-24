import { Express } from 'express';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { basePath } from '../../shared-utils/Miljø';
import { modellVersjon } from '../../shared-utils/modellversjon';

export const konfigurerModellVersjonEndpoint = (app: Express): Express => {
    app.get(`${basePath}modellversjon`, (_, res) => res.send(byggSuksessRessurs(modellVersjon)));
    return app;
};
