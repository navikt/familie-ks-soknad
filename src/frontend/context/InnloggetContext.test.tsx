import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import { RessursStatus } from '@navikt/familie-typer';

import { InnloggetStatus } from '../utils/autentisering';

import { preferredAxios } from './axios';
import { InnloggetProvider, useInnloggetContext } from './InnloggetContext';
import { LastRessurserProvider } from './LastRessurserContext';

describe('innloggetContext', () => {
    test(`Skal vise info når brukeren er autentisert`, async () => {
        // For å kunne sjekke state underveis bruker vi falske timere og delay på requesten vi mocker
        jest.useFakeTimers();
        const axiosMock = new MockAdapter(preferredAxios, { delayResponse: 2000 });

        axiosMock.onGet(/\/api\/innlogget/).reply(200, {
            status: RessursStatus.SUKSESS,
            data: 'Autentisert kall',
        });

        const wrapper = ({ children }) => (
            <LastRessurserProvider>
                <InnloggetProvider>{children}</InnloggetProvider>
            </LastRessurserProvider>
        );
        const { result } = renderHook(() => useInnloggetContext(), { wrapper });

        expect(result.current.innloggetStatus).toEqual(InnloggetStatus.IKKE_VERIFISERT);

        jest.runAllTimers();

        await waitFor(() =>
            expect(result.current.innloggetStatus).toEqual(InnloggetStatus.AUTENTISERT)
        );
    });

    test(`Skal vise info når brukeren ikke er autentisert`, async () => {
        // For å kunne sjekke state underveis bruker vi falske timere og delay på requesten vi mocker
        jest.useFakeTimers();
        const axiosMock = new MockAdapter(preferredAxios, { delayResponse: 2000 });

        axiosMock.onGet(/\/api\/innlogget/).reply(200, {
            status: RessursStatus.IKKE_TILGANG,
            data: 'Autentisert kall',
        });

        const wrapper = ({ children }) => (
            <LastRessurserProvider>
                <InnloggetProvider>{children}</InnloggetProvider>
            </LastRessurserProvider>
        );
        const { result } = renderHook(() => useInnloggetContext(), { wrapper });

        expect(result.current.innloggetStatus).toEqual(InnloggetStatus.IKKE_VERIFISERT);

        jest.runAllTimers();

        await waitFor(() => expect(result.current.innloggetStatus).toEqual(InnloggetStatus.FEILET));
    });
});
