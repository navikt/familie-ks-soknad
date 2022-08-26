import React from 'react';

import { RessursStatus } from '@navikt/familie-typer';

import AlertStripe from './components/Felleskomponenter/AlertStripe/AlertStripe';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useApp } from './context/AppContext';
import Søknad from './Søknad';

const AppContainer = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();

    return (
        <main>
            {systemetLaster() && <SystemetLaster />}
            {sluttbruker.status === RessursStatus.IKKE_TILGANG && (
                <div>
                    <AlertStripe variant="warning">
                        {'Du må søke på papir. '}
                        <a href="https://www.nav.no/kontantstotte">
                            Klikk her for å gå til våre sider for kontantstøtte
                        </a>
                    </AlertStripe>
                </div>
            )}
            {systemetOK() && <Søknad />}
            {systemetFeiler() && !systemetLaster() && <Feilside />}
        </main>
    );
};

export default AppContainer;
