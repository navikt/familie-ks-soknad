import { Express, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { byggSuksessRessurs, Ressurs } from '@navikt/familie-typer';

import {
    EAllFeatureToggles,
    defaultFeatureToggleValues,
    ToggleKeys,
} from '../../frontend/typer/feature-toggles';
import { basePath } from '../../shared-utils/Miljø';
import { isEnabled } from '../utils/unleash';

const fetchAllFeatureTogglesHandler: RequestHandler<
    ParamsDictionary,
    Ressurs<EAllFeatureToggles>
> = (_, res) => {
    const featureToggles = Object.entries(ToggleKeys).reduce(
        (allFeatureToggles, featureToggleEntry) => {
            allFeatureToggles[featureToggleEntry[0]] = isEnabled(
                featureToggleEntry[1],
                defaultFeatureToggleValues[featureToggleEntry[0]]
            );
            return allFeatureToggles;
        },
        {} as EAllFeatureToggles
    );
    res.send(byggSuksessRessurs(featureToggles));
};

export const konfigurerAllFeatureTogglesEndpoint = (app: Express): Express => {
    app.get(`${basePath}toggles/all`, fetchAllFeatureTogglesHandler);
    return app;
};
