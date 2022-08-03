import { modellVersjon } from '../shared-utils/modellversjon';

interface MiljøProps {
    soknadApi: string;
    loginService: string;
    visInnsendingsknapp: boolean;
    mellomlagerUrl: string;
    modellVersjon: number;
    dokumentUrl: string;
}

export const basePath = process.env.BASE_PATH ?? '/';

export const routerBasePath = basePath;

const Miljø = (): MiljøProps => {
    if (window.location.hostname.indexOf('familie-ks-soknad.dev') > -1) {
        return {
            soknadApi: `https://familie-ks-soknad.dev.nav.no${basePath}api`,
            loginService: 'https://loginservice.dev.nav.no/login?',
            visInnsendingsknapp: true,
            mellomlagerUrl:
                'https://familie-dokument.dev.nav.no/familie/dokument/api/soknad/kontantstotte', //todo
            modellVersjon: modellVersjon,
            dokumentUrl:
                'https://familie-dokument.dev.nav.no/familie/dokument/api/mapper/ANYTTHING', //Vil uansett gå til bucket "familievedlegg" enn så lenge
        };
    } else if (window.location.hostname.indexOf('www.nav') > -1) {
        return {
            soknadApi: `https://www.nav.no${basePath}api`,
            loginService: 'https://loginservice.nav.no/login?',
            visInnsendingsknapp: false,
            mellomlagerUrl: 'https://www.nav.no/familie/dokument/api/soknad/kontantstotte', //todo
            modellVersjon: modellVersjon,
            dokumentUrl: `https://www.nav.no/familie/dokument/api/mapper/ANYTTHING`, //Vil uansett gå til bucket "familievedlegg" enn så lenge,
        };
    } else {
        return {
            soknadApi: `http://${window.location.hostname}:${window.location.port}${basePath}api`,
            loginService: `http://${window.location.hostname}:8080/local/cookie?issuerId=selvbetjening&audience=aud-localhost&cookiename=localhost-idtoken&subject=12345678901`,
            visInnsendingsknapp: true,
            mellomlagerUrl: `http://${window.location.hostname}:8082/api/soknad/kontantstotte`, //todo
            modellVersjon: modellVersjon,
            dokumentUrl: `http://${window.location.hostname}:8082/api/mapper/ANYTTHING`,
        };
    }
};

export default Miljø;
