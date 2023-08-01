import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { useLocation, useNavigate } from 'react-router-dom';

import { useApp } from './AppContext';
import { useSteg } from './StegContext';
import { ISteg, RouteEnum } from '../typer/routes';

const [AppNavigationProvider, useAppNavigation] = createUseContext(() => {
    const [komFra, settKomFra] = useState<ISteg>();
    const [visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal] = useState(false);
    const { hentNåværendeSteg, hentNesteSteg } = useSteg();
    const { fåttGyldigKvittering } = useApp();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (fåttGyldigKvittering && hentNåværendeSteg().route !== RouteEnum.Kvittering) {
            navigate(hentNesteSteg().path);
            settVisBlokkerTilbakeKnappModal(true);
        }
    }, [location]);

    return {
        komFra,
        settKomFra,
        visBlokkerTilbakeKnappModal,
        settVisBlokkerTilbakeKnappModal,
    };
});

export { AppNavigationProvider, useAppNavigation };
