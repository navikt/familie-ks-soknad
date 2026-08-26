import { hentFeatureToggles } from '@api/hentFeatureToggles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { defaultFeatureToggleValues, type EAllFeatureToggles } from '../../common/feature-toggles';
import { useHentFeatureToggles } from './useHentFeatureToggles';

vi.mock('@api/hentFeatureToggles', () => ({
    hentFeatureToggles: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

function Wrapper({ children }: PropsWithChildren) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useHentFeatureToggles', () => {
    test('returnerer feature-toggles fra apiet ved vellykket kall', async () => {
        const mockToggles = { minTestToggle: true } as unknown as EAllFeatureToggles;
        vi.mocked(hentFeatureToggles).mockResolvedValue(mockToggles);

        const { result } = renderHook(() => useHentFeatureToggles(), { wrapper: Wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockToggles);
    });

    test('faller tilbake til default-verdier hvis apikallet feiler', async () => {
        vi.mocked(hentFeatureToggles).mockRejectedValue(new Error('Noe gikk galt'));

        const { result } = renderHook(() => useHentFeatureToggles(), { wrapper: Wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(defaultFeatureToggleValues);
    });

    test('bruker options som blir sendt inn, f.eks. enabled: false hindrer henting', async () => {
        const { result } = renderHook(() => useHentFeatureToggles({ enabled: false }), { wrapper: Wrapper });

        await waitFor(() => expect(result.current.isPending).toBe(true));

        expect(result.current.fetchStatus).toBe('idle');
        expect(hentFeatureToggles).not.toHaveBeenCalled();
    });
});
