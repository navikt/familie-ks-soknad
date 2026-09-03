import { type IRoute, RouteEnum } from './typer/routes';

export const ROUTES: Record<RouteEnum, IRoute> = {
    [RouteEnum.Forside]: {
        path: '/',
        label: 'Forside',
        route: RouteEnum.Forside,
    },
    [RouteEnum.OmDeg]: {
        path: '/om-deg',
        label: 'Om deg',
        route: RouteEnum.OmDeg,
    },
    [RouteEnum.DinLivssituasjon]: {
        path: '/din-livssituasjon',
        label: 'Din Livssituasjon',
        route: RouteEnum.DinLivssituasjon,
    },
    [RouteEnum.VelgBarn]: {
        path: '/velg-barn',
        label: 'Velg barn',
        route: RouteEnum.VelgBarn,
    },
    [RouteEnum.OmBarna]: {
        path: '/om-barna',
        label: 'Om barna',
        route: RouteEnum.OmBarna,
    },
    [RouteEnum.OmBarnet]: {
        path: `/om-barnet/barn/:number`,
        label: `Om barnet`,
        route: RouteEnum.OmBarnet,
    },
    [RouteEnum.EøsForSøker]: {
        path: '/eøs-søker',
        label: 'Eøs søker',
        route: RouteEnum.EøsForSøker,
    },
    [RouteEnum.EøsForBarn]: {
        path: `/eøs-barn/barn/:number`,
        label: `Om EØS barn`,
        route: RouteEnum.EøsForBarn,
    },
    [RouteEnum.Oppsummering]: {
        path: '/oppsummering',
        label: 'Oppsummering',
        route: RouteEnum.Oppsummering,
    },
    [RouteEnum.Dokumentasjon]: {
        path: '/dokumentasjon',
        label: 'Dokumentasjon',
        route: RouteEnum.Dokumentasjon,
    },
    [RouteEnum.Kvittering]: {
        path: '/kvittering',
        label: 'Kvittering',
        route: RouteEnum.Kvittering,
    },
};
