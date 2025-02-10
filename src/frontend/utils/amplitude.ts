import { getAmplitudeInstance, getCurrentConsent } from '@navikt/nav-dekoratoren-moduler';

import { søknadstype } from '../typer/søknad';

const logger = getAmplitudeInstance('dekoratoren');

/* eslint-disable @typescript-eslint/no-explicit-any */
export function logEvent(eventName: string, eventProperties: any) {
    const consent = getCurrentConsent();

    if (consent && consent.consent.analytics) {
        logger(eventName, eventProperties);
    }
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
