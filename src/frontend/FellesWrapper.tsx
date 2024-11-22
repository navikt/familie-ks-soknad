import React, { ReactNode } from 'react';

import * as Sentry from '@sentry/react';

import { HttpProvider } from '@navikt/familie-http';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SanityProvider } from './context/SanityContext';
import { SpråkProvider } from './context/SpråkContext';
import { GlobalStyle } from './Theme';

interface Props {
    children?: ReactNode;
}

function FellesWrapper({ children }: Props) {
    return (
        <React.StrictMode>
            <SpråkProvider>
                <HttpProvider>
                    <Sentry.ErrorBoundary
                        fallback={() => <Feilside />}
                        beforeCapture={scope => scope.setTag('scope', 'familie-ks-soknad')}
                    >
                        <LastRessurserProvider>
                            <SanityProvider>
                                <GlobalStyle />
                                {children}
                            </SanityProvider>
                        </LastRessurserProvider>
                    </Sentry.ErrorBoundary>
                </HttpProvider>
            </SpråkProvider>
        </React.StrictMode>
    );
}

export default FellesWrapper;
