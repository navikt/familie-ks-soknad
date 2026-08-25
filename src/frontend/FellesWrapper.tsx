import { ApmErrorBoundary } from '@nais/apm/react';
import { HttpProvider } from '@navikt/familie-http';
import { type ReactNode, StrictMode } from 'react';
import { CookiesProvider } from 'react-cookie';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SpråkProvider } from './context/SpråkContext';
import './index.css';

interface Props {
    children?: ReactNode;
}

function FellesWrapper({ children }: Props) {
    return (
        <StrictMode>
            <CookiesProvider>
                <SpråkProvider>
                    <HttpProvider>
                        <ApmErrorBoundary fallback={<Feilside />}>
                            <LastRessurserProvider>{children}</LastRessurserProvider>
                        </ApmErrorBoundary>
                    </HttpProvider>
                </SpråkProvider>
            </CookiesProvider>
        </StrictMode>
    );
}

export default FellesWrapper;
