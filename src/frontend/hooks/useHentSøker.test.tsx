import { hentSøker } from '@api/hentSøker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { lagSøker } from '@testutils/testdata/søkerTestdata';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useHentSøker } from './useHentSøker';

vi.mock('@api/hentSøker', () => ({
    hentSøker: vi.fn(),
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

describe('useHentSøker', () => {
    test('returnerer søker fra apiet ved vellykket kall', async () => {
        const søker = lagSøker();
        vi.mocked(hentSøker).mockResolvedValue(søker);

        const { result } = renderHook(() => useHentSøker(), { wrapper: Wrapper });

        expect(result.current.isPending).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(hentSøker).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(søker);
    });

    test('returnerer isError dersom kallet feiler', async () => {
        vi.mocked(hentSøker).mockRejectedValue(new Error('Noe gikk galt'));

        const { result } = renderHook(() => useHentSøker(), { wrapper: Wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.data).toBeUndefined();
    });

    test('bruker options som blir sendt inn, f.eks. enabled: false hindrer henting', async () => {
        const { result } = renderHook(() => useHentSøker({ enabled: false }), { wrapper: Wrapper });

        await waitFor(() => expect(result.current.isPending).toBe(true));

        expect(result.current.fetchStatus).toBe('idle');
        expect(hentSøker).not.toHaveBeenCalled();
    });
});
