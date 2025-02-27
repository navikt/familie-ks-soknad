import React from 'react';

import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { RouteEnum } from '../typer/routes';

import { RoutesProvider, useRoutesContext } from './RoutesContext';

test('Kan hente ut info om routes fra RoutesContext', () => {
    const Eksempelkomponent = () => {
        const { hentRouteObjektForRouteEnum } = useRoutesContext();

        return (
            <>
                <span>
                    Route-label: {hentRouteObjektForRouteEnum(RouteEnum.DinLivssituasjon).label}
                </span>
                <span>
                    Route-path: {hentRouteObjektForRouteEnum(RouteEnum.DinLivssituasjon).path}
                </span>
            </>
        );
    };
    render(
        <RoutesProvider>
            <Eksempelkomponent />
        </RoutesProvider>
    );
    expect(screen.getByText(/^Route-label:/)).toHaveTextContent('Route-label: Din Livssituasjon');
    expect(screen.getByText(/^Route-path:/)).toHaveTextContent('Route-path: /din-livssituasjon');
});
