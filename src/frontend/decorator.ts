import { erProd } from '@common/miljø';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';

export function hentDekorator() {
    const env = erProd() ? 'prod' : 'dev';
    injectDecoratorClientSide({
        env: env,
        params: {
            context: 'privatperson',
            simple: true,
            teamName: 'teambaks.teamfamilie',
        },
    }).catch(e => {
        console.error('Dekoratøren ble ikke hentet', e);
    });
}
