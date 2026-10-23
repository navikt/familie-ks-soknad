import { verifiserInnloggetBruker } from '@api/verifiserInnloggetBruker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useVerifiserInnloggetBruker } from './useVerifiserInnloggetBruker';

vi.mock('@api/verifiserInnloggetBruker', () => ({
    verifiserInnloggetBruker: vi.fn(),
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

describe('useVerifiserInnloggetBruker', () => {
    test('returnerer isSuccess ved vellykket verifisering', async () => {
        vi.mocked(verifiserInnloggetBruker).mockResolvedValue('OK');

        const { result } = renderHook(() => useVerifiserInnloggetBruker(), { wrapper: Wrapper });

        expect(result.current.isPending).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(verifiserInnloggetBruker).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual('OK');
    });

    test('returnerer isError dersom verifiseringen feiler', async () => {
        vi.mocked(verifiserInnloggetBruker).mockRejectedValue(new Error('Ikke innlogget'));

        const { result } = renderHook(() => useVerifiserInnloggetBruker(), { wrapper: Wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.data).toBeUndefined();
    });
});
