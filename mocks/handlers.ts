import { http, HttpResponse } from 'msw';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { urlMedBasePath } from './utils';

export const handlers = [
    http.get(urlMedBasePath('modellversjon'), () => {
        return HttpResponse.json(byggSuksessRessurs(50));
    }),
    http.get(urlMedBasePath('toggles/all'), () => {
        return HttpResponse.json(byggSuksessRessurs({}));
    }),
    http.get(urlMedBasePath('api/innlogget/kontantstotte'), () => {
        return HttpResponse.json(byggSuksessRessurs('Autentisert kall'));
    }),
    http.delete(urlMedBasePath('dokument/soknad/kontantstotte'), () => {
        return HttpResponse.json(byggSuksessRessurs(''));
    }),
    http.get(urlMedBasePath('dokument/soknad/kontantstotte'), () => {
        return new HttpResponse(null, { status: 404 });
    }),
    http.get(urlMedBasePath('api/kontoregister/hent-kontonr'), () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                kontonummer: '815.493.00',
            })
        );
    }),
    http.get(urlMedBasePath('api/kodeverk/eos-land'), () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                BEL: 'Belgia',
                DNK: 'Danmark',
                CHE: 'Sveits',
                IRL: 'Irland',
                NLD: 'Nederland',
            })
        );
    }),
];
