import React from 'react';

import classNames from 'classnames';
import { useParams } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { DekoratørenSpråkHandler } from './components/Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import RedirectTilStart from './components/Felleskomponenter/RedirectTilStart/RedirectTilStart';
import Helse from './components/Helse/Helse';
import DinLivssituasjon from './components/SøknadsSteg/DinLivssituasjon/DinLivssituasjon';
import Dokumentasjon from './components/SøknadsSteg/Dokumentasjon/Dokumentasjon';
import EøsForBarn from './components/SøknadsSteg/EøsSteg/Barn/EøsForBarn';
import EøsForSøker from './components/SøknadsSteg/EøsSteg/Søker/EøsForSøker';
import Forside from './components/SøknadsSteg/Forside/Forside';
import Kvittering from './components/SøknadsSteg/Kvittering/Kvittering';
import OmBarnaDine from './components/SøknadsSteg/OmBarnaDine/OmBarnaDine';
import OmBarnet from './components/SøknadsSteg/OmBarnet/OmBarnet';
import OmDeg from './components/SøknadsSteg/OmDeg/OmDeg';
import Oppsummering from './components/SøknadsSteg/Oppsummering/Oppsummering';
import VelgBarn from './components/SøknadsSteg/VelgBarn/VelgBarn';
import { useApp } from './context/AppContext';
import { useEøs } from './context/EøsContext';
import { useRoutes } from './context/RoutesContext';
import { IRoute, RouteEnum } from './typer/routes';

/**
 * useParams må kalles fra en Route-komponent, derfor kan ikke denne inlines i Søknad-komponenten
 */
const OmBarnetWrapper: React.FC = () => {
    const { number } = useParams<{ number?: string }>();
    const { søknad } = useApp();
    const barnetsId = søknad.barnInkludertISøknaden[number ? Number.parseInt(number) - 1 : 0].id;
    // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
    return <OmBarnet barnetsId={barnetsId} key={barnetsId} />;
};

const EøsForBarnWrapper: React.FC = () => {
    const { number } = useParams<{ number?: string }>();
    const { barnSomTriggerEøs } = useEøs();
    const { søknad } = useApp();
    const barnSomSkalHaEøsSteg = søknad.søker.triggetEøs
        ? søknad.barnInkludertISøknaden.map(barn => barn.id)
        : barnSomTriggerEøs;
    const barnetsId = barnSomSkalHaEøsSteg[number ? Number.parseInt(number) - 1 : 0];
    return <EøsForBarn barnetsId={barnetsId} key={barnetsId} />;
};

const Søknad = () => {
    const { systemetLaster } = useApp();
    const { routes } = useRoutes();

    const routeTilKomponent = (route: IRoute): React.FC => {
        switch (route.route) {
            case RouteEnum.Forside:
                return Forside;
            case RouteEnum.OmDeg:
                return OmDeg;
            case RouteEnum.DinLivssituasjon:
                return DinLivssituasjon;
            case RouteEnum.VelgBarn:
                return VelgBarn;
            case RouteEnum.OmBarna:
                return OmBarnaDine;
            case RouteEnum.OmBarnet:
                return OmBarnetWrapper;
            case RouteEnum.EøsForSøker:
                return EøsForSøker;
            case RouteEnum.EøsForBarn:
                return EøsForBarnWrapper;
            case RouteEnum.Oppsummering:
                return Oppsummering;
            case RouteEnum.Dokumentasjon:
                return Dokumentasjon;
            case RouteEnum.Kvittering:
                return Kvittering;
        }
    };

    return (
        <div className={classNames(systemetLaster() && 'blur')}>
            <DekoratørenSpråkHandler />
            <Switch>
                <Route exact={true} path={'/helse'} component={Helse} />
                <Route exact={true} path={'/'} component={Forside} />
                {routes.map((route, index) => (
                    <RedirectTilStart
                        key={index}
                        exact={true}
                        path={route.path}
                        component={routeTilKomponent(route)}
                    />
                ))}
                <Route path={'*'} component={Forside} />
            </Switch>
        </div>
    );
};

export default Søknad;
