import amplitude from 'amplitude-js';

import { søknadstype } from '../typer/søknad';

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init('default', '', {
    apiEndpoint: 'amplitude.nav.no/collect-auto',
    saveEvents: false,
    includeUtm: true,
    includeReferrer: true,
    platform: window.location.toString(),
});

export enum UserProperty {
    ANTALL_VALGTE_BARN = 'antallValgteBarn',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function logEvent(eventName: string, eventProperties: any) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const logSidevisningKontantstøtte = (side: string) => {
    logEvent('sidevisning', {
        side,
        team_id: 'familie',
        skjemanavn: søknadstype.navn,
        skjemaId: søknadstype.id,
    });
};

export const logSkjemaStartet = () => {
    logEvent('skjema startet', {
        skjemanavn: søknadstype.navn,
        skjemaId: søknadstype.id,
        team_id: 'familie',
    });
};

export const logForsettPåSøknad = () => {
    logEvent('fortsett på søknad', {
        skjemanavn: søknadstype.navn,
        skjemaId: søknadstype.id,
        team_id: 'familie',
    });
};

export const logSkjemaStegFullført = (steg: number) => {
    logEvent('skjemasteg fullført', {
        skjemanavn: søknadstype.navn,
        skjemaId: søknadstype.id,
        team_id: 'familie',
        steg,
    });
};

export const logKlikkGåVidere = (steg: number) => {
    logEvent('klikk gå videre', {
        skjemanavn: søknadstype.navn,
        skjemaId: søknadstype.id,
        team_id: 'familie',
        steg,
    });
};

export const logSpørsmålBesvart = (spørsmålApiNavn: string, svar: string) => {
    spørsmålApiNavn &&
        logEvent('skjemaspørsmål besvart', {
            skjemanavn: søknadstype.navn,
            skjemaId: søknadstype.id,
            team_id: 'familie',
            spørsmål: spørsmålApiNavn,
            svar,
        });
};

export const logError = (error: Error) => {
    logEvent('logg feil', {
        skjemanavn: søknadstype.navn,
        skjemaId: søknadstype.id,
        team_id: 'familie',
        errorType: error.name,
        errorMessage: error.message,
    });
};

export const setUserProperty = (key: UserProperty, value: string | number) => {
    const identify = new amplitudeInstance.Identify().set(key, value);
    amplitudeInstance.identify(identify);
};
