import { http, HttpResponse } from 'msw';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { modellVersjon } from '../src/common/modellversjon';

import { urlMedBasePath } from './utils';

export const handlers = [
    http.get(urlMedBasePath('modellversjon'), () => {
        return HttpResponse.json(byggSuksessRessurs(modellVersjon));
    }),
    http.get(urlMedBasePath('toggles/all'), () => {
        return HttpResponse.json(byggSuksessRessurs({}));
    }),
    http.get(urlMedBasePath('api/innlogget/kontantstotte'), () => {
        return HttpResponse.json(byggSuksessRessurs('Autentisert kall'));
    }),
    http.post(urlMedBasePath('dokument/soknad/kontantstotte'), () => {
        return new HttpResponse(null, { status: 201 });
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
    http.post(urlMedBasePath('api/soknad/kontantstotte/v6'), () => {
        return HttpResponse.json(
            byggSuksessRessurs({
                tekst: 'Søknad mottatt',
                mottattDato: '2026-01-15T09:30:00',
            })
        );
    }),
    http.post(urlMedBasePath('dokument/mapper/familievedlegg'), () => {
        return HttpResponse.json({ dokumentId: crypto.randomUUID(), filnavn: 'vedlegg.pdf' }, { status: 201 });
    }),
    http.post(urlMedBasePath('logg'), () => {
        return new HttpResponse(null, { status: 204 });
    }),
];
