import { RequestHandler, Request, Response } from 'express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/søknadKontrakt';

export const erklaeringInterceptor: RequestHandler = (
    request: Request,
    response: Response,
    next
) => {
    const søknad: ISøknadKontrakt = request.body;
    const lestOgForståttErklæringKey = 'lestOgForståttBekreftelse';

    if (!(lestOgForståttErklæringKey in søknad)) {
        return response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat'));
    }

    if (søknad.lestOgForståttBekreftelse) {
        next();
    } else {
        return response
            .status(403)
            .send(byggFeiletRessurs('Du må huke av for at du oppgir korrekte opplysninger'));
    }
};
