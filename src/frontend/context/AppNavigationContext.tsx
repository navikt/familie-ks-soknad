import { useState } from 'react';

import createUseContext from 'constate';

import { ISteg } from '../typer/routes';

const [AppNavigationProvider, useAppNavigation] = createUseContext(() => {
    const [komFra, settKomFra] = useState<ISteg>();

    return {
        komFra,
        settKomFra,
    };
});

export { AppNavigationProvider, useAppNavigation };
