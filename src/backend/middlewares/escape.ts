import { RequestHandler } from 'express';
import xss from 'xss';

import { ISøknadKontrakt } from '../../common/typer/kontrakt/søknadKontrakt';

export const escapeBody: RequestHandler = async (req, _res, next) => {
    const søknad: ISøknadKontrakt = req.body;
    req.body = JSON.parse(xss(JSON.stringify(søknad)));
    next();
};
