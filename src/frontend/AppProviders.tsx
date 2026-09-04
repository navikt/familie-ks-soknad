import { ApiFeil, RessursStatus } from '@api/client/apiClient';
import { useHentFeatureToggles } from '@hooks/useHentFeatureToggles';
import { useHentSanityTekster } from '@hooks/useHentSanityTekster';
import { useHentSøker } from '@hooks/useHentSøker';
import { useVerifiserInnloggetBruker } from '@hooks/useVerifiserInnloggetBruker';
import { ApmErrorBoundary } from '@nais/apm/react';
import { Box, GlobalAlert, Page } from '@navikt/ds-react';
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
import { SøkerProvider } from './context/SøkerContext';
import { InnloggetStatus, utledInnloggetStatus } from './utils/autentisering';

const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            gcTime: 0,
            staleTime: 0,
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
                                <UnauthenticatedProviders>{children}</UnauthenticatedProviders>
                            </LastRessurserProvider>
                        </HttpProvider>
                    </QueryClientProvider>
                </ApmErrorBoundary>
            </SpråkProvider>
        </CookiesProvider>
    );
}

function UnauthenticatedProviders({ children }: PropsWithChildren) {
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
            <SanityProvider tekster={sanityTekster}>
                <AuthenticatedProviders>{children}</AuthenticatedProviders>
            </SanityProvider>
        </FeatureTogglesProvider>
    );
}

function AuthenticatedProviders({ children }: PropsWithChildren) {
    const { data: søker, isPending: søkerIsPending, error: søkerError } = useHentSøker();

    if (søkerIsPending) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <SystemetLaster />
                </Page.Block>
            </main>
        );
    }

    if (søkerError instanceof ApiFeil && søkerError.ressursStatus === RessursStatus.IKKE_TILGANG) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <Box marginBlock="space-128">
                        <GlobalAlert status={'warning'}>
                            <GlobalAlert.Header>
                                <GlobalAlert.Title>Du må søke på papir.</GlobalAlert.Title>
                            </GlobalAlert.Header>
                            <GlobalAlert.Content>
                                <a href="https://www.nav.no/kontantstotte">
                                    Klikk her for å gå til våre sider for kontantstøtte
                                </a>
                            </GlobalAlert.Content>
                        </GlobalAlert>
                    </Box>
                </Page.Block>
            </main>
        );
    }

    if (søkerError) {
        return (
            <main>
                <Page.Block width={'text'} gutters={true}>
                    <Feilside />
                </Page.Block>
            </main>
        );
    }

    return (
        <SøkerProvider key={søker.ident} søker={søker}>
            {children}
        </SøkerProvider>
    );
}
