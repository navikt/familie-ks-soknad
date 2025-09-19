import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { matchPath, useLocation } from 'react-router';

import { IBarnMedISøknad } from '../typer/barn';
import { ISteg, RouteEnum } from '../typer/routes';

import { useAppContext } from './AppContext';
import { useEøsContext } from './EøsContext';
import { useRoutesContext } from './RoutesContext';

interface StegContext {
    steg: ISteg[];
    barnForSteg: IBarnMedISøknad[];
    settBarnForSteg: (barnMedSøknad: IBarnMedISøknad[]) => void;
    hentStegNummer: (route: RouteEnum, barn?: IBarnMedISøknad) => number;
    hentStegObjektForBarn: (barn: IBarnMedISøknad) => ISteg;
    hentNesteSteg: () => ISteg;
    hentNåværendeSteg: () => ISteg;
    hentForrigeSteg: () => ISteg;
    hentNåværendeStegIndex: () => number;
    erPåKvitteringsside: () => boolean;
    hentStegObjektForBarnEøs: (barn: IBarnMedISøknad) => ISteg;
}

const StegContext = createContext<StegContext | undefined>(undefined);

export function StegProvider(props: PropsWithChildren) {
    const { søknad } = useAppContext();
    const { barnInkludertISøknaden } = søknad;
    const { pathname } = useLocation();
    const { routes } = useRoutesContext();

    const [barnForSteg, settBarnForSteg] = useState<IBarnMedISøknad[]>([]);
    const { barnSomTriggerEøs, søkerTriggerEøs } = useEøsContext();

    useEffect(() => {
        settBarnForSteg(søknad.barnInkludertISøknaden);
    }, [søknad.barnInkludertISøknaden]);

    const steg: ISteg[] = routes
        .map((route): ISteg | ISteg[] => {
            const barnRoute = routes.find(route => route.route === RouteEnum.OmBarnet);
            const barnEøsRoute = routes.find(route => route.route === RouteEnum.EøsForBarn);

            switch (route.route) {
                case RouteEnum.OmBarnet:
                    const omBarnetSteg = barnForSteg.map((_barn, index) => ({
                        path: barnRoute?.path.replace(':number', (index + 1) as unknown as string) ?? '/',
                        route: RouteEnum.OmBarnet,
                        label: route.label,
                    }));
                    return omBarnetSteg.length
                        ? omBarnetSteg
                        : {
                              path: barnRoute?.path.replace(':number', 1 as unknown as string) ?? '/',
                              route: RouteEnum.OmBarnet,
                              label: route.label,
                          };
                case RouteEnum.EøsForBarn:
                    const barnSomSkalHaEøsSteg = søkerTriggerEøs
                        ? barnInkludertISøknaden.map(barn => barn.id)
                        : barnSomTriggerEøs;
                    return barnSomSkalHaEøsSteg.map((_barnId, index) => ({
                        path: barnEøsRoute?.path.replace(':number', (index + 1) as unknown as string) ?? '/',
                        route: RouteEnum.EøsForBarn,
                        label: route.label,
                    }));
                case RouteEnum.EøsForSøker:
                    return søkerTriggerEøs || barnSomTriggerEøs.length ? route : [];
                default:
                    return { path: route.path, route: route.route, label: route.label };
            }
        })
        .flat();

    const hentSteg = (pathname: string): ISteg => {
        const index = steg.findIndex(steg => matchPath(steg.path, decodeURIComponent(pathname)));
        return steg[index] ?? steg[0];
    };

    const hentStegNummer = (route: RouteEnum, barn?: IBarnMedISøknad): number => {
        switch (route) {
            case RouteEnum.OmBarnet:
            case RouteEnum.EøsForBarn:
                const index = barnInkludertISøknaden.findIndex(barnISøknad => barn === barnISøknad);
                return steg.findIndex(steg => steg.route === route) + Math.max(index, 0);
            default:
                return steg.findIndex(steg => steg.route === route);
        }
    };

    const hentNåværendeSteg = (): ISteg => {
        return hentSteg(pathname);
    };

    const hentNesteSteg = (): ISteg => {
        const nåværendeSteg = hentSteg(pathname);
        const nåværendeIndex = steg.findIndex(steg => steg === nåværendeSteg);
        return steg[Math.min(nåværendeIndex + 1, steg.length - 1)];
    };

    const hentForrigeSteg = (): ISteg => {
        const nåværendeSteg = hentSteg(pathname);
        const nåværendeIndex = steg.findIndex(steg => steg === nåværendeSteg);
        return steg[Math.max(nåværendeIndex - 1, 0)];
    };

    const hentStegObjektForBarn = (barn: IBarnMedISøknad): ISteg => {
        return steg[hentStegNummer(RouteEnum.OmBarnet, barn)];
    };

    const hentStegObjektForBarnEøs = (barn: IBarnMedISøknad): ISteg => {
        return steg[hentStegNummer(RouteEnum.EøsForBarn, barn)];
    };

    const hentNåværendeStegIndex = (): number => {
        return Math.max(
            steg.findIndex(steg => steg === hentNåværendeSteg()),
            0
        );
    };

    const erPåKvitteringsside = () => hentNåværendeSteg().route === RouteEnum.Kvittering;
    return (
        <StegContext.Provider
            value={{
                steg,
                barnForSteg,
                settBarnForSteg,
                hentStegNummer,
                hentStegObjektForBarn,
                hentNesteSteg,
                hentNåværendeSteg,
                hentForrigeSteg,
                hentNåværendeStegIndex,
                erPåKvitteringsside,
                hentStegObjektForBarnEøs,
            }}
        >
            {props.children}
        </StegContext.Provider>
    );
}

export function useStegContext() {
    const context = useContext(StegContext);

    if (context === undefined) {
        throw new Error('useStegContext må brukes innenfor StegContext');
    }

    return context;
}
