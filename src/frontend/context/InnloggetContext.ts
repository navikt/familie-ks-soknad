import { useEffect, useState } from 'react';

import createUseContext from 'constate';

import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';
import { useLastRessurserContext } from './LastRessurserContext';

const [InnloggetProvider, useInnloggetContext] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();

    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(
        InnloggetStatus.IKKE_VERIFISERT
    );

    const { soknadApi } = Miljø();

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
    }, [innloggetStatus]);

    const verifiserAtBrukerErAutentisert = (
        settInnloggetStatus: (innloggetStatus: InnloggetStatus) => void
    ) => {
        return axiosRequest({
            url: `${soknadApi}/innlogget`,
            method: 'GET',
            withCredentials: true,
            påvirkerSystemLaster: true,
        })
            .then(ressurs => {
                if (ressurs.status === RessursStatus.SUKSESS) {
                    settInnloggetStatus(InnloggetStatus.AUTENTISERT);
                } else {
                    settInnloggetStatus(InnloggetStatus.FEILET);
                }
            })
            .catch(_ => {
                settInnloggetStatus(InnloggetStatus.FEILET);
            });
    };

    return {
        innloggetStatus,
    };
});

export { InnloggetProvider, useInnloggetContext };
