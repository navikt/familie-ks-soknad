import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';

import { erProd } from '../common/miljø';

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
