import React, { createContext, PropsWithChildren, useContext } from 'react';

import { RouteEnum } from '../typer/routes';

export const omBarnetBasePath = 'om-barnet';
export const eøsBarnBasePath = 'eøs-barn';

export const getRoutes = () => {
    return [
        { path: '/', label: 'Forside', route: RouteEnum.Forside },
        { path: '/om-deg', label: 'Om deg', route: RouteEnum.OmDeg },
        {
            path: '/din-livssituasjon',
            label: 'Din Livssituasjon',
            route: RouteEnum.DinLivssituasjon,
        },
        { path: '/velg-barn', label: 'Velg barn', route: RouteEnum.VelgBarn },
        { path: '/om-barna', label: 'Om barna', route: RouteEnum.OmBarna },
        {
            path: `/${omBarnetBasePath}/barn/:number`,
            label: `Om barnet`,
            route: RouteEnum.OmBarnet,
        },
        {
            path: '/eøs-søker',
            label: 'Eøs søker',
            route: RouteEnum.EøsForSøker,
        },
        {
            path: `/${eøsBarnBasePath}/barn/:number`,
            label: `Om EØS barn`,
            route: RouteEnum.EøsForBarn,
        },
        {
            path: '/oppsummering',
            label: 'Oppsummering',
            route: RouteEnum.Oppsummering,
        },
        {
            path: '/dokumentasjon',
            label: 'Dokumentasjon',
            route: RouteEnum.Dokumentasjon,
        },
        {
            path: '/kvittering',
            label: 'Kvittering',
            route: RouteEnum.Kvittering,
        },
    ];
};

interface Route {
    path: string;
    label: string;
    route: RouteEnum;
}

export interface RoutesContext {
    routes: Array<Route>;
    hentRouteObjektForRouteEnum: (RouteEnum) => Route;
}

const RoutesContext = createContext<RoutesContext | undefined>(undefined);

export function RoutesProvider(props: PropsWithChildren) {
    const routes = getRoutes();
    const hentRouteObjektForRouteEnum = (routeEnum: RouteEnum) =>
        routes.find(route => route.route === routeEnum) ?? routes[0];

    return (
        <RoutesContext.Provider value={{ routes, hentRouteObjektForRouteEnum }}>
            {props.children}
        </RoutesContext.Provider>
    );
}

export function useRoutesContext() {
    const context = useContext(RoutesContext);

    if (context === undefined) {
        throw new Error('useRoutesContext må brukes innenfor RoutesProvider');
    }

    return context;
}
