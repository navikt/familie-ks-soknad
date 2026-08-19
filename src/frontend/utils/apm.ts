import { init, setTag } from '@nais/apm';

import { erDev, erProd } from '../../common/miljø';

export const initApm = () => {
    if (erDev() || erProd()) {
        init({
            ignoreErrors: [/dekoratoren\/client/],
        });
        setTag('scope', 'familie-ks-soknad');
    }
};
