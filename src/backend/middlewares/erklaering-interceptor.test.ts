import { Request, Response } from 'express';
import { mockDeep } from 'jest-mock-extended';
import { DeepPartial } from 'ts-essentials';

import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/v1';
import { erklaeringInterceptor, hentSpråkteksterAlleSpråk } from './erklaering-interceptor';

describe('erklaering-interceptor', () => {
    const aksepterteSvarSpråkNøkkel = 'forside.bekreftelsesboks.erklæring.spm';

    const request = (partialSøknad: DeepPartial<ISøknadKontrakt>) =>
        mockDeep<Request>({
            body: partialSøknad,
        });

    const response = mockDeep<Response>({
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    });

    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
        response.status.mockReset();
        response.status.mockReturnThis();
        response.send.mockReset();
    });

    it('sender 400 hvis søknad ikke har korrekt format', () => {
        const invalidRequests: DeepPartial<ISøknadKontrakt>[] = [
            {},
            { spørsmål: {} },
            { spørsmål: { lestOgForståttBekreftelse: {} } },
            { spørsmål: { lestOgForståttBekreftelse: { label: { nb: 'test' } } } },
        ];

        invalidRequests.forEach(reqData => {
            erklaeringInterceptor(request(reqData), response, next);
            expect(next).not.toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.send).toHaveBeenCalled();
            response.send.mockReset();
            response.status.mockReset().mockReturnThis();
        });
    });

    it('Sender 403 hvis søker ikke har erklært riktig informasjon', () => {
        const reqData = {
            spørsmål: {
                lestOgForståttBekreftelse: { label: { nb: 'test' }, verdi: { nb: 'NEI' } },
            },
        };
        erklaeringInterceptor(request(reqData), response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(403);
        expect(response.send).toHaveBeenCalled();
    });

    it('Sender videre til neste handler hvis søker har erklært riktig informasjon på noe språk', () => {
        const aksepterteSvar = hentSpråkteksterAlleSpråk(aksepterteSvarSpråkNøkkel);

        Object.entries(aksepterteSvar).forEach(([locale, answer]) => {
            const reqData = {
                spørsmål: {
                    lestOgForståttBekreftelse: {
                        label: { [locale]: 'test' },
                        verdi: { [locale]: answer },
                    },
                },
                originalSpråk: locale as LocaleType,
            };
            erklaeringInterceptor(request(reqData), response, next);
            expect(response.status).not.toHaveBeenCalled();
            expect(response.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            next.mockReset();
        });
    });

    it('Kan hente bekreftelsestekst for alle språk', () => {
        const svar = hentSpråkteksterAlleSpråk(aksepterteSvarSpråkNøkkel);
        for (const locale in LocaleType) {
            expect(svar).toHaveProperty(locale);
            expect(svar[locale].length).toBeGreaterThan(0);
        }
    });
});
