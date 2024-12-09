import * as Sentry from '@sentry/react';
import type { Breadcrumb, ErrorEvent, EventHint } from '@sentry/react';

const environment = window.location.hostname;

const maskeringsregler = [
    {
        regex: /[0-9]{6}\s?[0-9]{5}/g,
        erstatning: '<fnr>',
    },
];

// Exportes kun for å kunne testes
export const fjernPersonopplysninger = (event: ErrorEvent, _hint?: EventHint): ErrorEvent => {
    const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';
    return {
        ...event,
        event_id: maskerPersonopplysninger(event.event_id),
        message: maskerPersonopplysninger(event.message),
        request: {
            ...event.request,
            url,
            headers: {
                Referer: maskerPersonopplysninger(event.request?.headers?.Referer) || '',
            },
            data: maskerPersonoppysningerIObjekt(event.request?.data),
        },
        breadcrumbs: (event.breadcrumbs || []).map((breadcrumb: Breadcrumb) => ({
            ...breadcrumb,
            event_id: maskerPersonopplysninger(event.event_id),
            message: maskerPersonopplysninger(breadcrumb.message),
            data: maskerPersonoppysningerIObjekt(breadcrumb.data),
        })),
    };
};

const maskerPersonoppysningerIObjekt = <T>(data: T): T => {
    if (data === undefined) return data;

    const asText = JSON.stringify(data);
    const escaped = maskerPersonopplysninger(asText);

    return escaped ? JSON.parse(escaped) : undefined;
};

const maskerPersonopplysninger = (tekst?: string | undefined) => {
    if (!tekst) return undefined;

    let maskert = tekst;
    maskeringsregler.forEach(({ regex, erstatning }) => {
        maskert = maskert.replace(regex, erstatning);
    });

    return maskert;
};

export const initSentry = () => {
    Sentry.init({
        dsn: 'https://700a8fca9e5f411f9bc74df534d03389@sentry.gc.nav.no/137',
        environment,
        autoSessionTracking: false,
        denyUrls: [
            // Chrome extensions
            /extensions\//i,
            /^chrome:\/\//i,
            // Safari extensions
            /^safari-extension:/i,
            // external scripts
            /psplugin/,
            /dekoratoren\/client/,
        ],
        beforeSend: fjernPersonopplysninger,
        enabled: process.env.NODE_ENV !== 'development',
    });
};
