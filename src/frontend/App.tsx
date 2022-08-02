import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import AlertStripe from 'nav-frontend-alertstriper';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { FeatureTogglesProvider } from './context/FeatureToggleContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { RoutesProvider } from './context/RoutesContext';
import { StegProvider } from './context/StegContext';
import { routerBasePath } from './Miljø';
import { GlobalStyle } from './Theme';

function App() {
    return (
        <LastRessurserProvider>
            <InnloggetProvider>
                <FeatureTogglesProvider>
                    <AppProvider>
                        <EøsProvider>
                            <RoutesProvider>
                                <Router basename={routerBasePath}>
                                    <StegProvider>
                                        <GlobalStyle />
                                        {process.env.NODE_ENV !== 'production' && (
                                            <AlertStripe type="advarsel">
                                                {`Denne siden er under utvikling. `}
                                                <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                                    Klikk her for å gå til våre sider for barnetrygd
                                                </a>
                                            </AlertStripe>
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
        </LastRessurserProvider>
    );
}

export default App;
