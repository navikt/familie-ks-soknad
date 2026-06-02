import React, { ReactNode } from 'react';

import * as Sentry from '@sentry/react';
import { CookiesProvider } from 'react-cookie';

import { HttpProvider } from '@navikt/familie-http';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SanityProvider } from './context/SanityContext';
import { SpråkProvider } from './context/SpråkContext';
import './index.css';

interface Props {
    children?: ReactNode;
}

function FellesWrapper({ children }: Props) {
    return (
        <React.StrictMode>
            <CookiesProvider>
                <SpråkProvider>
                    <HttpProvider>
                        <Sentry.ErrorBoundary
                            fallback={() => <Feilside />}
                            beforeCapture={scope => scope.setTag('scope', 'familie-ks-soknad')}
                        >
                            <LastRessurserProvider>
                                <SanityProvider>{children}</SanityProvider>
                            </LastRessurserProvider>
                        </Sentry.ErrorBoundary>
                    </HttpProvider>
                </SpråkProvider>
            </CookiesProvider>
        </React.StrictMode>
    );
}

export default FellesWrapper;
