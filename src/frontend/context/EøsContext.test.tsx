import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';

import {
    mekkGyldigSøker,
    mekkGyldigUtenlandsoppholdEøs,
    mekkGyldigUtenlandsoppholdIkkeEøs,
    TestProvidere,
} from '../utils/testing';

import { EøsProvider, useEøsContext } from './EøsContext';

describe('EøsContext', () => {
    const wrapper = ({ children }) => (
        <TestProvidere>
            <EøsProvider>{children}</EøsProvider>
        </TestProvidere>
    );

    test(`Skal kunne sjekke om et land er EØS-land`, async () => {
        const { result } = renderHook(() => useEøsContext(), { wrapper });
        await waitFor(() => {
            expect(result.current.erEøsLand('DNK')).toEqual(true);
            expect(result.current.erEøsLand('ARG')).toEqual(false);
        });
    });

    test(`Skal kunne sjekke om et utenlandsopphold i EØS-land trigger EØS for søker`, async () => {
        const søker = mekkGyldigSøker();
        søker.utenlandsperioder = [mekkGyldigUtenlandsoppholdEøs()];

        const { result } = renderHook(() => useEøsContext(), { wrapper });
        await waitFor(() => {
            expect(result.current.skalTriggeEøsForSøker(søker)).toEqual(true);
        });
    });

    test(`Skal kunne sjekke om et utenlandsopphold utenfor EØS-land ikke trigger EØS for søker`, async () => {
        const søker = mekkGyldigSøker();
        søker.utenlandsperioder = [mekkGyldigUtenlandsoppholdIkkeEøs()];

        const { result } = renderHook(() => useEøsContext(), { wrapper });
        await waitFor(() => {
            expect(result.current.skalTriggeEøsForSøker(søker)).toEqual(false);
        });
    });
});
