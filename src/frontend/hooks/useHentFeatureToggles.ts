import type { ApiFeil } from '@api/client/apiClient';
import { hentFeatureToggles } from '@api/hentFeatureToggles';
import { MetaKey } from '@hooks/meta/metaKey';
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { defaultFeatureToggleValues, type EAllFeatureToggles } from '../../common/feature-toggles';

type Options = Omit<
    UseQueryOptions<EAllFeatureToggles, ApiFeil, EAllFeatureToggles>,
    'queryKey' | 'queryFn' | 'gcTime' | 'staleTime'
>;

export function useHentFeatureToggles(options?: Options) {
    return useQuery({
        queryKey: ['toggles'],
        queryFn: async () => {
            try {
                return await hentFeatureToggles();
            } catch {
                return defaultFeatureToggleValues;
            }
        },
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        meta: { [MetaKey.VIS_SYSTEMET_LASTER]: true },
        ...options,
    });
}
