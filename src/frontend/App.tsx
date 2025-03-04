import React from 'react';

import { BrowserRouter as Router } from 'react-router';

import { Alert } from '@navikt/ds-react';

import { basePath } from '../shared-utils/Miljø';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { FeatureTogglesProvider } from './context/FeatureTogglesContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { RoutesProvider } from './context/RoutesContext';
import { StegProvider } from './context/StegContext';

const App = () => {
    return (
        <InnloggetProvider>
            <FeatureTogglesProvider>
                <AppProvider>
                    <EøsProvider>
                        <RoutesProvider>
                            <Router basename={basePath}>
                                <StegProvider>
                                    {process.env.NODE_ENV !== 'production' && (
                                        <Alert variant="warning">
                                            {`Denne siden er under utvikling. `}
                                            <a href="https://www.nav.no/kontantstotte">
                                                Klikk her for å gå til våre sider for kontantstøtte
                                            </a>
                                        </Alert>
                                    )}
                                    <AppNavigationProvider>
                                        <AppContainer />
                                    </AppNavigationProvider>
                                </StegProvider>
                            </Router>
                        </RoutesProvider>
                    </EøsProvider>
                </AppProvider>
            </FeatureTogglesProvider>
        </InnloggetProvider>
    );
};

export default App;
