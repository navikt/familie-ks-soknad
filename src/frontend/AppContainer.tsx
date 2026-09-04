import { useVisSystemetLaster } from '@hooks/useVisSystemetLaster';
import { Page } from '@navikt/ds-react';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useAppContext } from './context/AppContext';
import Søknad from './Søknad';

const AppContainer = () => {
    const { systemetFeiler, systemetOK } = useAppContext();

    const visSystemetLaster = useVisSystemetLaster();

    return (
        <main>
            <Page.Block width="text" gutters>
                {visSystemetLaster && <SystemetLaster />}
                {systemetOK() && <Søknad />}
                {systemetFeiler() && !visSystemetLaster && <Feilside />}
            </Page.Block>
        </main>
    );
};

export default AppContainer;
