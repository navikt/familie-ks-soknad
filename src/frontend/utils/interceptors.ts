import { apiClient } from '@api/client/apiClient';
import axios, { type AxiosError } from 'axios';
import miljø, { BASE_PATH } from '../../common/miljø';

/**
 * Må kalles synkront ved oppstart av appen (før React-treet monteres), ikke fra en
 * useEffect. Axios' interceptor-kjede fryses når et kall starter, så registreres
 * interceptorene i en useEffect kan et etterkommer-kall (f.eks. innloggingsverifisering
 * i React Query) rekke å starte før interceptorene er på plass. Da vil et 401-svar ikke
 * bli fanget opp av Wonderwall-redirecten.
 */
export function registerAxiosInterceptors(): void {
    // Denne må være her så lenge man ikke har gått over til apiClient 100%
    axios.interceptors.response.use(response => response, onRequestRejectedInterceptor);

    apiClient.addResponseInterceptor({ onRejected: onRequestRejectedInterceptor });
}

export function onRequestRejectedInterceptor(error: AxiosError) {
    if (error.response?.status === 401) {
        window.location.href = `${miljø().wonderwallUrl}${window.location.origin}${BASE_PATH}`;
    }
    throw error;
}
