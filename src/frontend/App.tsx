import React from 'react';

import { BrowserRouter as Router } from 'react-router';

import { GlobalAlert } from '@navikt/ds-react';

import { BASE_PATH } from '../shared-utils/miljø';

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
                            <Router basename={BASE_PATH}>
                                <StegProvider>
                                    {process.env.NODE_ENV !== 'production' && (
                                        <GlobalAlert status={'warning'}>
                                            <GlobalAlert.Header>
                                                <GlobalAlert.Title>
                                                    {`Denne siden er under utvikling. `}
                                                </GlobalAlert.Title>
                                            </GlobalAlert.Header>
                                            <GlobalAlert.Content>
                                                <a href="https://www.nav.no/kontantstotte">
                                                    Klikk her for å gå til våre sider for kontantstøtte
                                                </a>
                                            </GlobalAlert.Content>
                                        </GlobalAlert>
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
