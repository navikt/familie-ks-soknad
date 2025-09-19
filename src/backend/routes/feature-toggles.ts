import { Express, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { byggSuksessRessurs, type Ressurs } from '@navikt/familie-typer';

import { EAllFeatureToggles, defaultFeatureToggleValues, ToggleKeys } from '../../frontend/typer/feature-toggles';
import { BASE_PATH } from '../../shared-utils/miljø';
import { isEnabled } from '../utils/unleash';

const fetchAllFeatureTogglesHandler: RequestHandler<ParamsDictionary, Ressurs<EAllFeatureToggles>> = (_, res) => {
    const featureToggles = Object.entries(ToggleKeys).reduce((allFeatureToggles, featureToggleEntry) => {
        allFeatureToggles[featureToggleEntry[0]] = isEnabled(
            featureToggleEntry[1],
            defaultFeatureToggleValues[featureToggleEntry[0]]
        );
        return allFeatureToggles;
    }, {} as EAllFeatureToggles);
    res.send(byggSuksessRessurs(featureToggles));
};

export const konfigurerAllFeatureTogglesEndpoint = (app: Express): Express => {
    app.get(`${BASE_PATH}toggles/all`, fetchAllFeatureTogglesHandler);
    return app;
};
