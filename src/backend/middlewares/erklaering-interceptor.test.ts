import { Request, Response } from 'express';
import { DeepPartial } from 'ts-essentials';
import { mockDeep } from 'vitest-mock-extended';

import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/søknadKontrakt';

import { erklaeringInterceptor } from './erklaering-interceptor';

describe('erklaering-interceptor', () => {
    const request = (partialSøknad: DeepPartial<ISøknadKontrakt>) =>
        mockDeep<Request>({
            body: partialSøknad,
        });

    const response = mockDeep<Response>({
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
    });

    const next = vi.fn();

    beforeEach(() => {
        next.mockReset();
        response.status.mockReset();
        response.status.mockReturnThis();
        response.send.mockReset();
    });

    it('sender 400 hvis søknad ikke har korrekt format', () => {
        const invalidRequest1: DeepPartial<ISøknadKontrakt> = {};

        erklaeringInterceptor(request(invalidRequest1), response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.send).toHaveBeenCalled();
        response.send.mockReset();
        response.status.mockReset().mockReturnThis();
    });

    it('Sender 403 hvis søker ikke har erklært riktig informasjon', () => {
        const reqData = {
            lestOgForståttBekreftelse: false,
        };
        erklaeringInterceptor(request(reqData), response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(403);
        expect(response.send).toHaveBeenCalled();
    });

    it('Sender videre til neste handler hvis søker har erklært riktig informasjon på noe språk', () => {
        const reqData = {
            lestOgForståttBekreftelse: true,
        };
        erklaeringInterceptor(request(reqData), response, next);
        expect(response.status).not.toHaveBeenCalled();
        expect(response.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        next.mockReset();
    });
});
