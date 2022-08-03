import axios, { AxiosError } from 'axios';

import { Ressurs, RessursStatus, ApiRessurs } from '@navikt/familie-typer';

axios.defaults.baseURL = window.location.origin;
export const preferredAxios = axios;

export const håndterApiRessurs = <T>(ressurs: ApiRessurs<T>): Ressurs<T> => {
    let typetRessurs: Ressurs<T> = {
        status: RessursStatus.IKKE_HENTET,
    };

    switch (ressurs.status) {
        case RessursStatus.SUKSESS:
            typetRessurs = {
                data: ressurs.data,
                status: RessursStatus.SUKSESS,
            };
            break;
        case RessursStatus.IKKE_TILGANG:
            typetRessurs = {
                frontendFeilmelding: ressurs.frontendFeilmelding ?? 'Ikke tilgang',
                status: RessursStatus.IKKE_TILGANG,
            };
            break;
        case RessursStatus.FEILET:
            apiLoggFeil(ressurs.melding);
            typetRessurs = {
                frontendFeilmelding: ressurs.frontendFeilmelding ?? 'En feil har oppstått!',
                status: RessursStatus.FEILET,
            };
            break;
        default:
            typetRessurs = {
                frontendFeilmelding: 'En feil har oppstått!',
                status: RessursStatus.FEILET,
            };
            break;
    }

    return typetRessurs;
};

export const loggFeil = (error?: AxiosError, feilmelding?: string): void => {
    apiLoggFeil(
        `${error ? `${error}${feilmelding ? ' - ' : ''}` : ''}${
            feilmelding ? `Feilmelding: ${feilmelding}` : ''
        }`
    );
};

export const apiLoggFeil = (melding: string) => {
    if (!['development', 'test'].find(env => env === process.env.NODE_ENV)) {
        console.log(melding);
    }
};
