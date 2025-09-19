import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { createClient } from '@sanity/client';

import { byggHenterRessurs, byggTomRessurs, type Ressurs, RessursStatus } from '@navikt/familie-typer';

import miljø from '../../shared-utils/miljø';
import { SanityDokument } from '../typer/sanity/sanity';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { transformerTilTekstinnhold } from '../utils/sanity';

import { loggFeil } from './axios';
import { useLastRessurserContext } from './LastRessurserContext';

export interface SanityContext {
    teksterRessurs: Ressurs<ITekstinnhold>;
}

const SanityContext = createContext<SanityContext | undefined>(undefined);

export function SanityProvider(props: PropsWithChildren) {
    const { settRessurserSomLaster, fjernRessursSomLaster, ressurserSomLaster } = useLastRessurserContext();
    const [teksterRessurs, settTeksterRessurs] = useState(byggTomRessurs<ITekstinnhold>());

    const sanityKlient = createClient({
        projectId: 'by26nl8j',
        dataset: miljø().sanityDataset,
        apiVersion: '2021-10-21',
        useCdn: true,
    });

    useEffect(() => {
        const ressursId = 'sanity';
        settRessurserSomLaster([...ressurserSomLaster, ressursId]);
        settTeksterRessurs(byggHenterRessurs());

        sanityKlient
            .fetch<SanityDokument[]>('*')
            .then(dokumenter => {
                fjernRessursSomLaster(ressursId);
                settTeksterRessurs({
                    data: transformerTilTekstinnhold(dokumenter),
                    status: RessursStatus.SUKSESS,
                });
            })
            .catch(error => {
                fjernRessursSomLaster(ressursId);
                settTeksterRessurs({
                    frontendFeilmelding: 'Kunne ikke hente tekster fra Sanity',
                    status: RessursStatus.FEILET,
                });
                loggFeil(error);
            });
    }, []);

    return <SanityContext.Provider value={{ teksterRessurs }}>{props.children}</SanityContext.Provider>;
}

export function useSanityContext() {
    const context = useContext(SanityContext);

    if (context === undefined) {
        throw new Error('useSanityContext må brukes innenfor SanityProvider');
    }

    return context;
}
