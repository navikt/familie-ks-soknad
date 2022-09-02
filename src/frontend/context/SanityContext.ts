import { useEffect, useState } from 'react';

import sanityClient from '@sanity/client';
import createUseContext from 'constate';

import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { INavigasjonTekstinnhold } from '../typer/sanity/navigasjon';
import {
    ESanitySteg,
    frittståendeOrdPrefix,
    modalPrefix,
    navigasjonPrefix,
    SanityDokument,
} from '../typer/sanity/sanity';
import {
    IFrittståendeOrdInnhold,
    IModalerInnhold,
    ITekstinnhold,
} from '../typer/sanity/tekstInnhold';
import { innholdForFellesHof, innholdForStegHof } from '../utils/sanity';
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
        const innholdForSteg = innholdForStegHof(dokumenter);
        const innholdForFelles = innholdForFellesHof(dokumenter);

        const tekstInnhold: Partial<ITekstinnhold> = {};

        for (const steg in ESanitySteg) {
            tekstInnhold[ESanitySteg[steg]] = innholdForSteg(ESanitySteg[steg]);
        }

        tekstInnhold.modaler = innholdForFelles(modalPrefix) as IModalerInnhold;
        tekstInnhold.frittståendeOrd = innholdForFelles(
            frittståendeOrdPrefix
        ) as IFrittståendeOrdInnhold;
        tekstInnhold.navigasjon = innholdForFelles(navigasjonPrefix) as INavigasjonTekstinnhold;

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
                    data: transformerTilTekstinnhold(dokumenter) as ITekstinnhold,
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
