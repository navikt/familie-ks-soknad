export interface ISteg {
    path: string;
    label: string;
    route: RouteEnum;
}

export interface IRoute {
    path: string;
    label: string;
    route: RouteEnum;
}

export enum RouteEnum {
    Forside = 'Forside',
    OmDeg = 'OmDeg',
    DinLivssituasjon = 'DinLivssituasjon',
    VelgBarn = 'VelgBarn',
    OmBarna = 'OmBarna',
    OmBarnet = 'OmBarnet',
    Oppsummering = 'Oppsummering',
    Dokumentasjon = 'Dokumentasjon',
    Kvittering = 'Kvittering',
    EøsForSøker = 'EøsForSøker',
    EøsForBarn = 'EøsForBarn',
}
