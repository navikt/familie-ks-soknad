import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { RessursStatus } from '@navikt/familie-typer';

import { server } from '../../../mocks/node';
import { urlMedBasePath } from '../../../mocks/utils';
import { InnloggetStatus } from '../utils/autentisering';

import { InnloggetProvider, useInnloggetContext } from './InnloggetContext';
import { LastRessurserProvider } from './LastRessurserContext';

describe('innloggetContext', () => {
    test(`Skal vise info når brukeren er autentisert`, async () => {
        const wrapper = ({ children }) => (
            <LastRessurserProvider>
                <InnloggetProvider>{children}</InnloggetProvider>
            </LastRessurserProvider>
        );
        const { result } = renderHook(() => useInnloggetContext(), { wrapper });

        expect(result.current.innloggetStatus).toEqual(InnloggetStatus.IKKE_VERIFISERT);

        await waitFor(() => expect(result.current.innloggetStatus).toEqual(InnloggetStatus.AUTENTISERT));
    });

    test(`Skal vise info når brukeren ikke er autentisert`, async () => {
        server.use(
            http.get(urlMedBasePath('api/innlogget/kontantstotte'), () => {
                return HttpResponse.json({
                    status: RessursStatus.IKKE_TILGANG,
                });
            })
        );

        const wrapper = ({ children }) => (
            <LastRessurserProvider>
                <InnloggetProvider>{children}</InnloggetProvider>
            </LastRessurserProvider>
        );
        const { result } = renderHook(() => useInnloggetContext(), { wrapper });

        expect(result.current.innloggetStatus).toEqual(InnloggetStatus.IKKE_VERIFISERT);

        await waitFor(() => expect(result.current.innloggetStatus).toEqual(InnloggetStatus.FEILET));
    });
});
