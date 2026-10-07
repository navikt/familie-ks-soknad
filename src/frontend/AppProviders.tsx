import { useHentFeatureToggles } from '@hooks/useHentFeatureToggles';
import { useHentSanityTekster } from '@hooks/useHentSanityTekster';
import { useVerifiserInnloggetBruker } from '@hooks/useVerifiserInnloggetBruker';
import { ApmErrorBoundary } from '@nais/apm/react';
import { Page } from '@navikt/ds-react';
import { HttpProvider } from '@navikt/familie-http';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import type { PropsWithChildren } from 'react';
import { CookiesProvider } from 'react-cookie';
import { erProd } from '../common/miljø';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { loggFeil } from './context/axios';
import { FeatureTogglesProvider } from './context/FeatureTogglesContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SanityProvider } from './context/SanityContext';
import { SpråkProvider } from './context/SpråkContext';
import { InnloggetStatus, utledInnloggetStatus } from './utils/autentisering';

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
        <CookiesProvider>
            <SpråkProvider>
                <ApmErrorBoundary fallback={<Feilside />}>
                    <QueryClientProvider client={queryClient}>
                        {!erProd() && <ReactQueryDevtools position={'right'} initialIsOpen={false} />}
                        <HttpProvider>
                            <LastRessurserProvider>
                                <Providers>{children}</Providers>
                            </LastRessurserProvider>
                        </HttpProvider>
                    </QueryClientProvider>
                </ApmErrorBoundary>
            </SpråkProvider>
        </CookiesProvider>
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

    const {
        isSuccess: innloggetBrukerVerifiseringIsSuccess,
        isPending: innloggetBrukerVerifiseringIsPending,
        isError: innloggetBrukerVerifiseringIsError,
    } = useVerifiserInnloggetBruker();

    const innloggetStatus = utledInnloggetStatus(
        innloggetBrukerVerifiseringIsSuccess,
        innloggetBrukerVerifiseringIsPending,
        innloggetBrukerVerifiseringIsError
    );

    if (
        sanityTeksterIsPending ||
        featureTogglesIsPending ||
        innloggetBrukerVerifiseringIsPending ||
        innloggetStatus === InnloggetStatus.IKKE_VERIFISERT
    ) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <SystemetLaster />
                </Page.Block>
            </main>
        );
    }

    if (
        sanityTeksterError ||
        featureTogglesError ||
        innloggetBrukerVerifiseringIsError ||
        innloggetStatus === InnloggetStatus.FEILET
    ) {
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
