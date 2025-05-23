import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { CookiesProvider } from 'react-cookie';

import { RessursStatus } from '@navikt/familie-typer';

import {
    mekkGyldigSøker,
    mekkGyldigUtenlandsoppholdEøs,
    mekkGyldigUtenlandsoppholdIkkeEøs,
} from '../utils/testing';

import { AppProvider } from './AppContext';
import { preferredAxios } from './axios';
import { EøsProvider, useEøsContext } from './EøsContext';
import { InnloggetProvider } from './InnloggetContext';
import { LastRessurserProvider } from './LastRessurserContext';
import { SanityProvider } from './SanityContext';
import { SpråkProvider } from './SpråkContext';

describe('EøsContext', () => {
    const forkortetListeAvEøsLand = {
        BEL: 'Belgia',
        DNK: 'Danmark',
        CHE: 'Sveits',
        IRL: 'Irland',
        NLD: 'Nederland',
    };

    const wrapper = ({ children }) => (
        <CookiesProvider>
            <SpråkProvider>
                <LastRessurserProvider>
                    <InnloggetProvider>
                        <SanityProvider>
                            <AppProvider>
                                <EøsProvider>{children}</EøsProvider>
                            </AppProvider>
                        </SanityProvider>
                    </InnloggetProvider>
                </LastRessurserProvider>
            </SpråkProvider>
        </CookiesProvider>
    );

    beforeEach(() => {
        const axiosMock = new MockAdapter(preferredAxios);

        axiosMock.onGet(/\/api\/innlogget/).reply(200, {
            status: RessursStatus.SUKSESS,
            data: 'Autentisert kall',
        });

        axiosMock.onGet(/\/kodeverk\/eos-land/).reply(200, {
            status: RessursStatus.SUKSESS,
            data: forkortetListeAvEøsLand,
        });
    });

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
