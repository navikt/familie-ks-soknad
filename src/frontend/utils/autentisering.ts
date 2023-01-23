import { AxiosError } from 'axios';

import Miljø, { routerBasePath } from '../../shared-utils/Miljø';
import { preferredAxios as axios } from '../context/axios';

const er401Feil = (error: AxiosError) => error && error.response && error.response.status === 401;
const getLoginUrl = () => {
    return `${Miljø().wonderwallUrl}${window.location.origin}${routerBasePath}`;
};

export enum InnloggetStatus {
    AUTENTISERT,
    FEILET,
    IKKE_VERIFISERT,
}

export const autentiseringsInterceptor = () => {
    axios.interceptors.response.use(
        response => {
            return response;
        },
        (error: AxiosError) => {
            if (er401Feil(error)) {
                window.location.href = getLoginUrl();
            } else {
                throw error;
            }
        }
    );
};
