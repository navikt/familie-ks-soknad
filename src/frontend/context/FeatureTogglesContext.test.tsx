import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import { RessursStatus } from '@navikt/familie-typer';

import { EFeatureToggle } from '../typer/feature-toggles';

import { preferredAxios } from './axios';
import { FeatureTogglesProvider, useFeatureToggles } from './FeatureTogglesContext';
import { LastRessurserProvider } from './LastRessurserContext';

describe('FeatureToggleContext', () => {
    test(`Skal hente ut alle toggles`, async () => {
        const axiosMock = new MockAdapter(preferredAxios);
        const toggles = {
            [EFeatureToggle.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP]: false,
        };

        axiosMock.onGet(/\/toggles\/all/).reply(200, {
            status: RessursStatus.SUKSESS,
            data: toggles,
        });

        const wrapper = ({ children }) => (
            <LastRessurserProvider>
                <FeatureTogglesProvider>{children}</FeatureTogglesProvider>
            </LastRessurserProvider>
        );
        const { result } = renderHook(() => useFeatureToggles(), { wrapper });

        await waitFor(() => expect(result.current.toggles).toEqual(toggles));
    });
});
