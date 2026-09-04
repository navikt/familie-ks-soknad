import type { ApiFeil } from '@api/client/apiClient';
import { hentSøker } from '@api/hentSøker';
import { MetaKey } from '@hooks/meta/metaKey';
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { ISøkerRespons } from '../typer/person';

type Options = Omit<UseQueryOptions<ISøkerRespons, ApiFeil, ISøkerRespons>, 'queryKey' | 'queryFn'>;

export function useHentSøker(options?: Options) {
    return useQuery({
        queryKey: ['søker'],
        queryFn: hentSøker,
        meta: { [MetaKey.VIS_SYSTEMET_LASTER]: true },
        ...options,
    });
}
