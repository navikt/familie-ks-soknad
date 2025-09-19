import { RequestHandler, Request, Response, NextFunction } from 'express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/søknadKontrakt';

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
