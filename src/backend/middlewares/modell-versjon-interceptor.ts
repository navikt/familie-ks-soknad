import { type ApiRessurs, RessursStatus } from '@navikt/familie-typer';
import type { RequestHandler } from 'express';

import {
    type ModellMismatchRespons,
    modellMismatchMelding,
    modellVersjon,
    modellVersjonHeaderName,
} from '../../common/modellversjon.js';

export const modellVersjonInterceptor: RequestHandler = (req, res, next) => {
    const requestModellVersjon = req.get(modellVersjonHeaderName);
    const requestModellVersjonInt = Number.parseInt(requestModellVersjon ?? '0');
    if (!requestModellVersjon || requestModellVersjonInt < modellVersjon) {
        const responsBody: ApiRessurs<ModellMismatchRespons> = {
            data: { modellVersjon },
            melding: modellMismatchMelding,
            stacktrace: '',
            status: RessursStatus.FEILET,
        };
        res.status(403).send(responsBody);
    } else {
        next();
    }
};
