import React from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import { RessursStatus } from '@navikt/familie-typer';

import { preferredAxios } from './axios';
import { LastRessurserProvider, useLastRessurserContext } from './LastRessurserContext';

describe('LastRessurserContext', () => {
    test(`Kan vise at ressurser laster når vi bruker axios-funksjonen til contexten`, async () => {
        // For å kunne sjekke state underveis bruker vi falske timere og delay på requesten vi mocker
        jest.useFakeTimers();
        const axiosMock = new MockAdapter(preferredAxios, { delayResponse: 2000 });

        axiosMock.onGet(/\/testing/).reply(200, {
            status: RessursStatus.SUKSESS,
            data: 'Autentisert kall',
        });

        const wrapper = ({ children }) => <LastRessurserProvider>{children}</LastRessurserProvider>;
        const { result } = renderHook(() => useLastRessurserContext(), { wrapper });

        expect(result.current.lasterRessurser()).toEqual(false);

        const axiosRequest = result.current.axiosRequest;

        act(() => {
            axiosRequest<number, void>({
                url: `/testing`,
                påvirkerSystemLaster: true,
            });
        });

        expect(result.current.lasterRessurser()).toEqual(true);

        jest.runAllTimers();

        await waitFor(() => expect(result.current.lasterRessurser()).toEqual(false));
    });

    test(`Kan vise at ressurser laster når vi bruker wrapMedSystemetLaster på custome promises`, async () => {
        const wrapper = ({ children }) => <LastRessurserProvider>{children}</LastRessurserProvider>;
        const { result } = renderHook(() => useLastRessurserContext(), { wrapper });

        let promiseResolve;

        const promise = new Promise(function (resolve) {
            promiseResolve = resolve;
        });

        expect(result.current.lasterRessurser()).toEqual(false);

        act(() => {
            result.current.wrapMedSystemetLaster(async () => await promise);
        });

        expect(result.current.lasterRessurser()).toEqual(true);

        promiseResolve();

        await waitFor(() => expect(result.current.lasterRessurser()).toEqual(false));
    });
});
