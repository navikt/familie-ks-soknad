import { byggFeiletRessurs } from '@navikt/familie-typer';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import type { ISøknadKontrakt } from '../../common/typer/kontrakt/søknadKontrakt.js';

export const erklaeringInterceptor: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const søknad: ISøknadKontrakt = request.body;
    const lestOgForståttErklæringKey = 'lestOgForståttBekreftelse';

    if (!(lestOgForståttErklæringKey in søknad)) {
        response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat'));
        return;
    }

    if (søknad.lestOgForståttBekreftelse) {
        next();
    } else {
        response.status(403).send(byggFeiletRessurs('Du må huke av for at du oppgir korrekte opplysninger'));
    }
};
