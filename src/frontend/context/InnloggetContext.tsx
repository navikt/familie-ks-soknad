import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { RessursStatus } from '@navikt/familie-typer';

import miljø from '../../shared-utils/miljø';
import { autentiseringsInterceptor, InnloggetStatus } from '../utils/autentisering';

import { useLastRessurserContext } from './LastRessurserContext';

interface InnloggetContext {
    innloggetStatus: InnloggetStatus;
}

const InnloggetContext = createContext<InnloggetContext | undefined>(undefined);

export function InnloggetProvider(props: PropsWithChildren) {
    const { axiosRequest } = useLastRessurserContext();

    const [innloggetStatus, settInnloggetStatus] = useState<InnloggetStatus>(InnloggetStatus.IKKE_VERIFISERT);

    const { soknadApiProxyUrl } = miljø();

    autentiseringsInterceptor();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.IKKE_VERIFISERT) {
            verifiserAtBrukerErAutentisert(settInnloggetStatus);
        }
    }, [innloggetStatus]);

    const verifiserAtBrukerErAutentisert = (settInnloggetStatus: (innloggetStatus: InnloggetStatus) => void) => {
        return axiosRequest({
            url: `${soknadApiProxyUrl}/innlogget/kontantstotte`,
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

    return <InnloggetContext.Provider value={{ innloggetStatus }}>{props.children}</InnloggetContext.Provider>;
}

export function useInnloggetContext() {
    const context = useContext(InnloggetContext);

    if (context === undefined) {
        throw new Error('useInnloggetContext må brukes innenfor InnloggetProvider');
    }

    return context;
}
