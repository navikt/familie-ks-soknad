import { Response, Request } from 'express';
import { mockDeep } from 'vitest-mock-extended';

import { type ApiRessurs, RessursStatus } from '@navikt/familie-typer';

import { modellMismatchMelding, ModellMismatchRespons, modellVersjon } from '../../shared-utils/modellversjon';

import { modellVersjonInterceptor } from './modell-versjon-interceptor';

describe('modell-versjon-interceptor', () => {
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

    it('Sender 403 hvis modellversjon ikke matcher', () => {
        const request = mockDeep<Request>({
            get: vi.fn().mockReturnValue(`${modellVersjon - 1}`),
        });
        modellVersjonInterceptor(request, response, next);
        expect(next).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(403);
        expect(response.send).toHaveBeenCalled();

        const expectedResponse: ApiRessurs<ModellMismatchRespons> = {
            data: { modellVersjon },
            melding: modellMismatchMelding,
            stacktrace: '',
            status: RessursStatus.FEILET,
        };
        expect(response.send).toHaveBeenCalledWith(expectedResponse);
    });

    it('Kaller neste handler hvis modellversjon matcher', () => {
        const request = mockDeep<Request>({
            get: vi.fn().mockReturnValue(`${modellVersjon}`),
        });
        modellVersjonInterceptor(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(response.status).not.toHaveBeenCalledWith(403);
        expect(response.send).not.toHaveBeenCalled();
    });
});
