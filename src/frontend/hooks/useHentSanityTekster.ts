import { hentSanityTekster } from '@api/hentSanityTekster';
import { useQuery } from '@tanstack/react-query';
import { transformerTilTekstinnhold } from '../utils/sanity';
import { MetaKey } from './meta/metaKey';

export function useHentSanityTekster() {
    return useQuery({
        queryKey: ['sanity'],
        queryFn: hentSanityTekster,
        select: transformerTilTekstinnhold,
        gcTime: 0,
        meta: { [MetaKey.VIS_SYSTEMET_LASTER]: true },
    });
}
