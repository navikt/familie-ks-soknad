import { renderHook } from '@testing-library/react';

import { defaultFeatureToggleValues, type EAllFeatureToggles } from '../../common/feature-toggles';
import { FeatureTogglesProvider, useFeatureToggles } from './FeatureTogglesContext';

describe('FeatureTogglesContext', () => {
    test('gir default-verdier når providerens toggles-prop ikke er satt', () => {
        const wrapper = ({ children }) => <FeatureTogglesProvider>{children}</FeatureTogglesProvider>;
        const { result } = renderHook(() => useFeatureToggles(), { wrapper });

        expect(result.current.toggles).toEqual(defaultFeatureToggleValues);
    });

    test('gir toggles som blir sendt inn via providerens toggles-prop', () => {
        const mockToggles = { minTestToggle: true } as unknown as EAllFeatureToggles;
        const wrapper = ({ children }) => (
            <FeatureTogglesProvider toggles={mockToggles}>{children}</FeatureTogglesProvider>
        );
        const { result } = renderHook(() => useFeatureToggles(), { wrapper });

        expect(result.current.toggles).toEqual(mockToggles);
    });

    test('kaster feil når useFeatureToggles brukes utenfor FeatureTogglesProvider', () => {
        expect(() => renderHook(() => useFeatureToggles())).toThrow(
            'useFeatureToggles må brukes innenfor FeatureTogglesProvider'
        );
    });
});
