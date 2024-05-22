import { initialize, Unleash } from 'unleash-client';

let unleash: Unleash;
export const initializeUnleash = () => {
    const UNLEASH_SERVER_API_URL = process.env.UNLEASH_SERVER_API_URL
        ? process.env.UNLEASH_SERVER_API_URL + '/api'
        : 'https://teamfamilie-unleash-api.nav.cloud.nais.io/api';

    unleash = initialize({
        url: UNLEASH_SERVER_API_URL,
        customHeaders: {
            Authorization: process.env.UNLEASH_SERVER_API_TOKEN ?? '',
        },
        appName: process.env.NAIS_APP_NAME ?? 'familie-ba-soknad',
    });
};

export const isEnabled = (feature: string, defaultValue?: boolean): boolean => {
    // Hvis vi bare deconstructer og eksporterer isEnabled fra unleash crasher det fordi isEnabled ikke veit hva `this` er...
    return unleash.isEnabled(feature, undefined, defaultValue);
};
