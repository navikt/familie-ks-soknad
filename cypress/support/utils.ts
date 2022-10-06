import { getRoutes } from '../../src/frontend/context/RoutesContext';
import { RouteEnum } from '../../src/frontend/typer/routes';

export const hentRoute = (route: RouteEnum) =>
    getRoutes().find(r => r.route === route) ?? getRoutes()[0];
