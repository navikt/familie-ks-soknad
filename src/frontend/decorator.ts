import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';

import { erProd } from '../shared-utils/Miljø';

export function hentDekorator() {
    const env = erProd() ? 'prod' : 'dev';
    injectDecoratorClientSide({
        env: env,
        params: {
            context: 'privatperson',
            simple: true,
        },
    }).catch(e => {
        console.error('Dekoratøren ble ikke hentet', e);
    });
}
