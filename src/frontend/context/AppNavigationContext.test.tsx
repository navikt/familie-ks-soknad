import { renderHook, waitFor } from '@testing-library/react';

import { RouteEnum } from '../typer/routes';
import {
    mockEøs,
    mockFeatureToggle,
    mockHistory,
    spyOnUseApp,
    TestProvidere,
} from '../utils/testing';

import { useAppNavigation } from './AppNavigationContext';

mockHistory(['/om-barnet/barn/1']);

describe('AppNavigationContext', () => {
    beforeEach(() => {
        mockFeatureToggle();
        mockEøs();
    });
    test(`Kan kunne sette og hente hvor bruker navigerte fra`, async () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });

        const wrapper = ({ children }) => TestProvidere({ children });
        const { result } = renderHook(() => useAppNavigation(), { wrapper });
        expect(result.current.komFra).toEqual(undefined);
        const omDegSteg = { path: 'om-deg', label: 'Om deg', route: RouteEnum.OmDeg };

        result.current.settKomFra(omDegSteg);

        await waitFor(() => {
            expect(result.current.komFra).toEqual(omDegSteg);
        });
    });
});
