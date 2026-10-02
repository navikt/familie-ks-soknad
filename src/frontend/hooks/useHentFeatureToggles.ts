import type { ApiFeil } from '@api/client/apiClient';
import { hentFeatureToggles } from '@api/hentFeatureToggles';
import { MetaKey } from '@hooks/meta/metaKey';
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { defaultFeatureToggleValues, type EAllFeatureToggles } from '../../common/feature-toggles';
import { logger, tilLoggFeil } from '../utils/logger';

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
            } catch (e: unknown) {
                const feilmelding = e instanceof Error ? e.message : 'En feil oppstod under innlasting av toggles.';
                logger.warn(
                    `Kunne ikke laste feature toggles, faller tilbake til standardverdier: ${feilmelding}`,
                    tilLoggFeil(e)
                );
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
