import { RequestHandler, Request, Response } from 'express';

import { LocaleType } from '@navikt/familie-sprakvelger';
import { byggFeiletRessurs } from '@navikt/familie-typer';

import engelsk from '../../frontend/assets/lang/en.json' assert { type: 'json' };
import bokmål from '../../frontend/assets/lang/nb.json' assert { type: 'json' };
import nynorsk from '../../frontend/assets/lang/nn.json' assert { type: 'json' };
import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/v1';

export const hentSpråkteksterAlleSpråk = (språknøkkel: string): Record<LocaleType, string> => {
    return {
        nb: bokmål[språknøkkel],
        nn: nynorsk[språknøkkel],
        en: engelsk[språknøkkel],
    };
};

export const erklaeringInterceptor: RequestHandler = (
    request: Request,
    response: Response,
    next
) => {
    const søknad: ISøknadKontrakt = request.body;
    const spmKey = 'lestOgForståttBekreftelse';
    const aksepterteSvarSpråkNøkkel = 'forside.bekreftelsesboks.erklæring.spm';
    const aksepterteSvar = Object.values(hentSpråkteksterAlleSpråk(aksepterteSvarSpråkNøkkel));

    if (
        !('spørsmål' in søknad && spmKey in søknad.spørsmål && 'verdi' in søknad.spørsmål[spmKey])
    ) {
        return response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat'));
    }

    const svar = søknad.spørsmål[spmKey];

    if (aksepterteSvar.includes(svar.verdi[søknad.originalSpråk])) {
        next();
    } else {
        return response
            .status(403)
            .send(byggFeiletRessurs('Du må huke av for at du oppgir korrekte opplysninger'));
    }
};
