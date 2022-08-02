import { Express, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { byggFeiletRessurs, byggSuksessRessurs, Ressurs } from '@navikt/familie-typer';

import { EAllFeatureToggles } from '../../frontend/typer/feature-toggles';
import { basePath } from '../environment';
import { isEnabled } from '../utils/unleash';

const toggleFetchHandler: RequestHandler = (req, res) => {
    const toggleId = req.params.id;
    if (!toggleId) {
        res.status(404).send(byggFeiletRessurs('Mangler toggle-id'));
        return;
    }

    res.send(byggSuksessRessurs(isEnabled(toggleId)));
};

export const konfigurerFeatureTogglesEndpoint = (app: Express): Express => {
    // Matcher bare toggles som tilhører oss, bruker {0,} pga en express-quirk
    // ref http://expressjs.com/en/guide/routing.html#route-parameters
    app.get(`${basePath}toggles/:id(familie-ks-soknad.[a-zA-Z-]{0,})`, toggleFetchHandler);
    return app;
};

const fetchAllFeatureTogglesHandler: RequestHandler<
    ParamsDictionary,
    Ressurs<EAllFeatureToggles>
> = (_, res) => {
    res.send(
        byggSuksessRessurs({
            // [EFeatureToggle.EXAMPLE]: isEnabled(ToggleKeys.EXAMPLE),
        })
    );
};

export const konfigurerAllFeatureTogglesEndpoint = (app: Express): Express => {
    app.get(`${basePath}toggles/all`, fetchAllFeatureTogglesHandler);
    return app;
};
