import type { ApiFeil } from '@api/client/apiClient';
import { hentSøker } from '@api/hentSøker';
import { MetaKey } from '@hooks/meta/metaKey';
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { ISøkerRespons } from '../typer/person';

type Options = Omit<
    UseQueryOptions<ISøkerRespons, ApiFeil, ISøkerRespons>,
    'queryKey' | 'queryFn' | 'gcTime' | 'staleTime'
>;

export function useHentSøker(options?: Options) {
    return useQuery({
        queryKey: ['søker'],
        queryFn: hentSøker,
        gcTime: 0,
        staleTime: 0,
        meta: { [MetaKey.VIS_SYSTEMET_LASTER]: true },
        ...options,
    });
}
