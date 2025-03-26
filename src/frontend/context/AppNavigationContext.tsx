import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { ISteg, RouteEnum } from '../typer/routes';

import { useAppContext } from './AppContext';
import { useStegContext } from './StegContext';

interface AppNavigationContext {
    komFra: ISteg | undefined;
    settKomFra: (komFra: ISteg | undefined) => void;
    visBlokkerTilbakeKnappModal: boolean;
    settVisBlokkerTilbakeKnappModal: (visBlokkerTilbakeKnappModal: boolean) => void;
}

const AppNavigationContext = createContext<AppNavigationContext | undefined>(undefined);

export function AppNavigationProvider(props: PropsWithChildren) {
    const [komFra, settKomFra] = useState<ISteg>();
    const [visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal] = useState(false);
    const { hentNåværendeSteg, hentNesteSteg } = useStegContext();
    const { fåttGyldigKvittering } = useAppContext();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (fåttGyldigKvittering && hentNåværendeSteg().route !== RouteEnum.Kvittering) {
            navigate(hentNesteSteg().path);
            settVisBlokkerTilbakeKnappModal(true);
        }
    }, [location]);

    return (
        <AppNavigationContext.Provider
            value={{
                komFra,
                settKomFra,
                visBlokkerTilbakeKnappModal,
                settVisBlokkerTilbakeKnappModal,
            }}
        >
            {props.children}
        </AppNavigationContext.Provider>
    );
}

export function useAppNavigationContext() {
    const context = useContext(AppNavigationContext);

    if (context === undefined) {
        throw new Error('useAppNavigationContext må brukes innenfor AppNavigationProvider');
    }

    return context;
}
