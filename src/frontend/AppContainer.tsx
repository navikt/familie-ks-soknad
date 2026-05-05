import React from 'react';

import { Box, GlobalAlert, Page } from '@navikt/ds-react';
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
                    <Box marginBlock="space-128">
                        <GlobalAlert status={'warning'}>
                            <GlobalAlert.Header>
                                <GlobalAlert.Title>{'Du må søke på papir.'}</GlobalAlert.Title>
                            </GlobalAlert.Header>
                            <GlobalAlert.Content>
                                <a href="https://www.nav.no/kontantstotte">
                                    Klikk her for å gå til våre sider for kontantstøtte
                                </a>
                            </GlobalAlert.Content>
                        </GlobalAlert>
                    </Box>
                )}
                {systemetOK() && <Søknad />}
                {systemetFeiler() && !systemetLaster() && <Feilside />}
            </Page.Block>
        </main>
    );
};

export default AppContainer;
