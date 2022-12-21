import React from 'react';

import * as Sentry from '@sentry/react';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SanityProvider } from './context/SanityContext';
import { GlobalStyle } from './Theme';
import { logError } from './utils/amplitude';

const FellesWrapper = ({ children }) => {
    return (
        <React.StrictMode>
            <SprakProvider defaultLocale={LocaleType.nb}>
                <HttpProvider>
                    <Sentry.ErrorBoundary
                        fallback={() => <Feilside />}
                        beforeCapture={scope => scope.setTag('scope', 'familie-ks-soknad')}
                        onError={logError}
                    >
                        <LastRessurserProvider>
                            <SanityProvider>
                                <GlobalStyle />
                                {children}
                            </SanityProvider>
                        </LastRessurserProvider>
                    </Sentry.ErrorBoundary>
                </HttpProvider>
            </SprakProvider>
        </React.StrictMode>
    );
};

export default FellesWrapper;
