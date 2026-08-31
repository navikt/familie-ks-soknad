import { verifiserInnloggetBruker } from '@api/verifiserInnloggetBruker';
import { MetaKey } from '@hooks/meta/metaKey';
import { useQuery } from '@tanstack/react-query';

export function useVerifiserInnloggetBruker() {
    return useQuery({
        queryKey: ['innlogget'],
        queryFn: verifiserInnloggetBruker,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        meta: { [MetaKey.VIS_SYSTEMET_LASTER]: true },
    });
}
