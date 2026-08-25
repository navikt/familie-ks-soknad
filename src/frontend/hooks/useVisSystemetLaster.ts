import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { MetaKey } from './meta/metaKey';

export function useVisSystemetLaster() {
    const { systemetLaster } = useAppContext();

    const isFetching = useIsFetching({
        predicate: query => query.meta?.[MetaKey.VIS_SYSTEMET_LASTER] === true,
    });

    const isMutating = useIsMutating({
        predicate: query => query.meta?.[MetaKey.VIS_SYSTEMET_LASTER] === true,
    });

    return systemetLaster() || isFetching > 0 || isMutating > 0;
}
