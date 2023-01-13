import { useEffect, useState } from 'react';

import sanityClient from '@sanity/client';
import createUseContext from 'constate';

import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { SanityDokument } from '../typer/sanity/sanity';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { transformerTilTekstinnhold } from '../utils/sanity';
import { loggFeil } from './axios';
import { useLastRessurserContext } from './LastRessurserContext';

const [SanityProvider, useSanity] = createUseContext(() => {
    const { settRessurserSomLaster, fjernRessursSomLaster, ressurserSomLaster } =
        useLastRessurserContext();
    const [teksterRessurs, settTeksterRessurs] = useState(byggTomRessurs<ITekstinnhold>());

    const sanityKlient = sanityClient({
        projectId: 'by26nl8j',
        dataset: Miljø().sanityDataset,
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

    return {
        teksterRessurs,
    };
});

export { SanityProvider, useSanity };
