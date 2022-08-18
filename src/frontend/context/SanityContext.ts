import { useEffect, useState } from 'react';

import sanityClient from '@sanity/client';
import createUseContext from 'constate';

import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import {
    frittståendeOrdPrefix,
    ITekstinnhold,
    modalPrefix,
    SanityDokument,
} from '../typer/sanity/sanity';
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
        useCdn: false,
    });

    const transformerTilTekstinnhold = (dokumenter: SanityDokument[]): ITekstinnhold => {
        const tekstInnhold: Partial<ITekstinnhold> = {};

        dokumenter.forEach(dokument => {
            if (dokument.steg) {
                tekstInnhold[dokument.steg] = {
                    ...(tekstInnhold[dokument.steg] ?? {}),
                    [dokument.api_navn]: dokument,
                };
            } else if (dokument._type.includes(frittståendeOrdPrefix)) {
                tekstInnhold.frittståendeOrd = {
                    ...(tekstInnhold[dokument.api_navn] ?? {}),
                    [dokument.api_navn]: dokument,
                };
            } else if (dokument._type.includes(modalPrefix)) {
                tekstInnhold.modaler = {
                    ...(tekstInnhold[dokument.api_navn] ?? {}),
                    [dokument.api_navn]: dokument,
                };
            } else {
                tekstInnhold[dokument.api_navn] = dokument;
            }
        });

        return tekstInnhold as ITekstinnhold;
    };

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
