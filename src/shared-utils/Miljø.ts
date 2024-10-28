import { SanityDataSet } from '../frontend/typer/sanity/sanity';

import { modellVersjon } from './modellversjon';

interface MiljøProps {
    soknadApiProxyUrl: string;
    soknadApiUrl: string;
    dokumentProxyUrl: string;
    dokumentUrl: string;
    wonderwallUrl: string;
    oauthCallbackUri: string;
    modellVersjon: number;
    sanityDataset: SanityDataSet;
    port: number;
}

export const basePath = process.env.BASE_PATH ?? '/';

export const erProd = () => {
    if (typeof window === 'undefined') {
        return process.env.ENV === 'prod';
    }
    return window.location.hostname.indexOf('www') > -1;
};

export const erDev = () => {
    if (typeof window === 'undefined') {
        return process.env.ENV === 'dev';
    }
    return window.location.hostname.indexOf('dev') > -1;
};

export const erLokalt = () => !erProd() && !erDev();

const Miljø = (): MiljøProps => {
    if (erDev()) {
        return {
            sanityDataset: 'production',
            soknadApiProxyUrl: `https://familie-ks-soknad.intern.dev.nav.no${basePath}api`,
            soknadApiUrl: `http://familie-baks-soknad-api/api`,
            dokumentProxyUrl: `https://familie-ks-soknad.intern.dev.nav.no${basePath}dokument`,
            dokumentUrl: 'http://familie-dokument/familie/dokument/api', //Vil uansett gå til bucket "familievedlegg" enn så lenge
            modellVersjon: modellVersjon,
            wonderwallUrl:
                'https://familie-ks-soknad.intern.dev.nav.no/familie/kontantstotte/soknad/oauth2/login?redirect=',
            oauthCallbackUri:
                'https://familie-ks-soknad.intern.dev.nav.no/familie/kontantstotte/soknad/oauth2/callback',
            port: 9000,
        };
    } else if (erProd()) {
        return {
            sanityDataset: 'production',
            soknadApiProxyUrl: `https://www.nav.no${basePath}api`,
            soknadApiUrl: `http://familie-baks-soknad-api/api`,
            dokumentProxyUrl: `https://www.nav.no${basePath}dokument`,
            dokumentUrl: 'http://familie-dokument/familie/dokument/api', //Vil uansett gå til bucket "familievedlegg" enn så lenge,
            modellVersjon: modellVersjon,
            wonderwallUrl: 'https://www.nav.no/familie/kontantstotte/soknad/oauth2/login?redirect=',
            oauthCallbackUri: 'https://www.nav.no/familie/kontantstotte/soknad/oauth2/callback',
            port: 9000,
        };
    } else {
        return {
            sanityDataset: 'production',
            soknadApiProxyUrl: `http://localhost:3000${basePath}api`,
            soknadApiUrl: 'http://localhost:8080/api',
            dokumentProxyUrl: `http://localhost:3000${basePath}dokument`,
            dokumentUrl: `http://localhost:8082/familie/dokument/api`,
            modellVersjon: modellVersjon,
            wonderwallUrl: '',
            oauthCallbackUri: `http://localhost:3000${basePath}`,
            port: 55554,
        };
    }
};

export default Miljø;
