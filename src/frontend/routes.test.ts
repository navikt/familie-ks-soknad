import { ROUTES } from './routes';
import { RouteEnum } from './typer/routes';

describe('ROUTES', () => {
    test('Skal inneholde et routeobjekt for hver verdi i RouteEnum', () => {
        Object.values(RouteEnum).forEach(routeEnum => {
            expect(ROUTES[routeEnum]).toBeDefined();
        });
    });

    test('Skal ha en path og et label for hver route', () => {
        Object.values(RouteEnum).forEach(routeEnum => {
            const route = ROUTES[routeEnum];
            expect(typeof route.path).toBe('string');
            expect(route.path.length).toBeGreaterThan(0);
            expect(typeof route.label).toBe('string');
            expect(route.label.length).toBeGreaterThan(0);
        });
    });

    test('route-feltet på hvert objekt skal matche nøkkelen det er lagret på', () => {
        Object.values(RouteEnum).forEach(routeEnum => {
            expect(ROUTES[routeEnum].route).toEqual(routeEnum);
        });
    });

    test('Skal ha forventede paths for kjente routes', () => {
        expect(ROUTES[RouteEnum.Forside].path).toEqual('/');
        expect(ROUTES[RouteEnum.OmDeg].path).toEqual('/om-deg');
        expect(ROUTES[RouteEnum.DinLivssituasjon].path).toEqual('/din-livssituasjon');
        expect(ROUTES[RouteEnum.VelgBarn].path).toEqual('/velg-barn');
        expect(ROUTES[RouteEnum.OmBarna].path).toEqual('/om-barna');
        expect(ROUTES[RouteEnum.OmBarnet].path).toEqual('/om-barnet/barn/:number');
        expect(ROUTES[RouteEnum.EøsForSøker].path).toEqual('/eøs-søker');
        expect(ROUTES[RouteEnum.EøsForBarn].path).toEqual('/eøs-barn/barn/:number');
        expect(ROUTES[RouteEnum.Oppsummering].path).toEqual('/oppsummering');
        expect(ROUTES[RouteEnum.Dokumentasjon].path).toEqual('/dokumentasjon');
        expect(ROUTES[RouteEnum.Kvittering].path).toEqual('/kvittering');
    });
});
