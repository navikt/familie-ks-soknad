import * as amplitude from '@amplitude/analytics-browser';
import { Identify } from '@amplitude/analytics-browser';

import { søknadstype } from '../typer/søknad';

amplitude
    .init('default', '', {
        serverUrl: 'https://amplitude.nav.no/collect-auto',
        autocapture: {
            attribution: true,
            pageViews: false,
            sessions: true,
            formInteractions: false,
            fileDownloads: false,
            elementInteractions: false,
        },
    })
    .promise.catch(error => {
        console.error('#MSA error initializing amplitude', error);
    });

export enum UserProperty {
    ANTALL_VALGTE_BARN = 'antallValgteBarn',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function logEvent(eventName: string, eventProperties: any) {
    amplitude.track(eventName, eventProperties);
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

export const setUserProperty = (key: UserProperty, value: string | number) => {
    const identify = new Identify().set(key, value);
    amplitude.identify(identify);
};
