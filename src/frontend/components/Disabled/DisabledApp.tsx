import React, { useEffect } from 'react';

import { GuidePanel, Heading, Page, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { useAppContext } from '../../context/AppContext';
import { useLastRessurserContext } from '../../context/LastRessurserContext';
import { useSanityContext } from '../../context/SanityContext';
import { Feilside } from '../Felleskomponenter/Feilside/Feilside';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import TekstBlock from '../Felleskomponenter/TekstBlock';

export const DisabledApp: React.FC = () => {
    const { tekster, plainTekst } = useAppContext();
    const { teksterRessurs } = useSanityContext();
    const { lasterRessurser } = useLastRessurserContext();

    if (lasterRessurser()) {
        return (
            <main>
                <SystemetLaster />
            </main>
        );
    }

    if (teksterRessurs.status !== RessursStatus.SUKSESS) {
        return (
            <main>
                <Page.Block width="text" gutters>
                    <Feilside />
                </Page.Block>
            </main>
        );
    }

    useEffect(() => {
        visSpråkvelger();
    }, []);

    const visSpråkvelger = () => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]).then();
    };

    const { vedlikeholdTittel, vedlikeholdBroedtekst, vedlikeholdVeileder } = tekster().FELLES.vedlikeholdsarbeid;

    return (
        <main>
            <Page.Block width="text" gutters>
                <VStack gap="12" marginBlock="32">
                    <GuidePanel>
                        <TekstBlock block={vedlikeholdVeileder} />
                    </GuidePanel>
                    <div>
                        <Heading level="1" size="large" spacing>
                            {plainTekst(vedlikeholdTittel)}
                        </Heading>
                        <TekstBlock block={vedlikeholdBroedtekst} />
                    </div>
                </VStack>
            </Page.Block>
        </main>
    );
};
