import React from 'react';

import { Alert, Box, Page } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useAppContext } from './context/AppContext';
import Søknad from './Søknad';

const AppContainer = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useAppContext();

    return (
        <main>
            <Page.Block width="text" gutters>
                {systemetLaster() && <SystemetLaster />}
                {sluttbruker.status === RessursStatus.IKKE_TILGANG && (
                    <Box marginBlock="32">
                        <Alert variant="warning">
                            {'Du må søke på papir.'}
                            <a href="https://www.nav.no/kontantstotte">
                                Klikk her for å gå til våre sider for kontantstøtte
                            </a>
                        </Alert>
                    </Box>
                )}
                {systemetOK() && <Søknad />}
                {systemetFeiler() && !systemetLaster() && <Feilside />}
            </Page.Block>
        </main>
    );
};

export default AppContainer;
