import { useHentFeatureToggles } from '@hooks/useHentFeatureToggles';
import { useHentSanityTekster } from '@hooks/useHentSanityTekster';
import { Page } from '@navikt/ds-react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import type { PropsWithChildren } from 'react';
import { erProd } from '../common/miljø';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { loggFeil } from './context/axios';
import { FeatureTogglesProvider } from './context/FeatureTogglesContext';
import { SanityProvider } from './context/SanityContext';

const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
    queryCache: new QueryCache({
        onError: error => {
            loggFeil(error instanceof AxiosError ? error : new AxiosError(error.message));
        },
    }),
    mutationCache: new MutationCache({
        onError: error => {
            loggFeil(error instanceof AxiosError ? error : new AxiosError(error.message));
        },
    }),
});

interface Props extends PropsWithChildren {
    queryClient?: QueryClient;
}

export function AppProviders({ queryClient = defaultQueryClient, children }: Props) {
    return (
        <QueryClientProvider client={queryClient}>
            {!erProd() && <ReactQueryDevtools position={'right'} initialIsOpen={false} />}
            <Providers>{children}</Providers>
        </QueryClientProvider>
    );
}

function Providers({ children }: PropsWithChildren) {
    const {
        data: sanityTekster,
        isPending: sanityTeksterIsPending,
        error: sanityTeksterError,
    } = useHentSanityTekster();

    const {
        data: featureToggles,
        isPending: featureTogglesIsPending,
        error: featureTogglesError,
    } = useHentFeatureToggles();

    if (sanityTeksterIsPending || featureTogglesIsPending) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <SystemetLaster />
                </Page.Block>
            </main>
        );
    }

    if (sanityTeksterError || featureTogglesError) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <Feilside />
                </Page.Block>
            </main>
        );
    }

    return (
        <FeatureTogglesProvider toggles={featureToggles}>
            <SanityProvider tekster={sanityTekster}>{children}</SanityProvider>
        </FeatureTogglesProvider>
    );
}
