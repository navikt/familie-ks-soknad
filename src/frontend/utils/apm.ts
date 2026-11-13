import { init, setTag } from '@nais/apm';

import { erDev, erProd } from '../../common/miljø';

export const NETTVERKSFEIL_LOGGET_AV_DEKORATØREN =
    /^console\.error: \[ERROR\] .*\{"error":"TypeError: (Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.)"/;

export const initApm = () => {
    if (erDev() || erProd()) {
        init({
            ignoreErrors: [/dekoratoren\/client/, NETTVERKSFEIL_LOGGET_AV_DEKORATØREN],
        });
        setTag('scope', 'familie-ks-soknad');
    }
};
