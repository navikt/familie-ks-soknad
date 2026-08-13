import { byggSuksessRessurs } from '@navikt/familie-typer';

import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import React from 'react';

import { server } from '../../../mocks/node';
import { urlMedBasePath } from '../../../mocks/utils';

import { FeatureTogglesProvider, useFeatureToggles } from './FeatureTogglesContext';
import { LastRessurserProvider } from './LastRessurserContext';

describe('FeatureToggleContext', () => {
    test(`Skal hente ut alle toggles`, async () => {
        const toggles = {};

        server.use(
            http.get(urlMedBasePath('toggles/all'), () => {
                return HttpResponse.json(byggSuksessRessurs(toggles));
            })
        );

        const wrapper = ({ children }) => (
            <LastRessurserProvider>
                <FeatureTogglesProvider>{children}</FeatureTogglesProvider>
            </LastRessurserProvider>
        );
        const { result } = renderHook(() => useFeatureToggles(), { wrapper });

        await waitFor(() => expect(result.current.toggles).toEqual(toggles));
    });
});
