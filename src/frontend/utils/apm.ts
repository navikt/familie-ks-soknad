import { init, setTag } from '@nais/apm';

import { erDev, erProd } from '../../common/miljø';

export const NETTVERKSFEIL_LOGGET_AV_DEKORATØREN =
    /^console\.error: \[ERROR\] .*\{"error":"TypeError: (Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.)"/;

export const SCRIPT_ERROR_FRA_ANNET_OPPHAV = /^Script error\.? Error /;

export const initApm = () => {
    if (erDev() || erProd()) {
        init({
            ignoreErrors: [
                /dekoratoren\/client/,
                NETTVERKSFEIL_LOGGET_AV_DEKORATØREN,
                // DEFAULT_IGNORE_ERRORS treffer ikke «Script error.» fordi Faro matcher mot melding + navn + stack
                SCRIPT_ERROR_FRA_ANNET_OPPHAV,
            ],
        });
        setTag('scope', 'familie-ks-soknad');
    }
};
