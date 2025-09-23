import React from 'react';

import { Heading, Link, Page, VStack, BodyShort } from '@navikt/ds-react';

export function DisabledApp() {
    return (
        <main>
            <Page.Block width="text" gutters>
                <VStack gap="16">
                    <div>
                        <Heading level="1" size="large" spacing>
                            Vi jobber med å forbedre siden
                        </Heading>
                        <BodyShort spacing>
                            Denne siden er midlertidig utilgjengelig mens vi legger til nytt innhold og gjør
                            forbedringer. Takk for tålmodigheten. Prøv gjerne igjen litt senere, eller send oss søknaden
                            på PDF/papir.
                        </BodyShort>
                        <BodyShort>
                            <Link href="https://www.nav.no/start/soknad-kontantstotte">Bruk PDF/papirskjema</Link>
                        </BodyShort>
                    </div>
                    <div>
                        <Heading level="1" size="large" spacing>
                            We’re working on this page
                        </Heading>
                        <BodyShort spacing>
                            This page is temporarily unavailable while we add new content and improvements. Thank you
                            for your patience. Please check back a bit later, or send the application on PDF/paper.
                        </BodyShort>
                        <BodyShort>
                            <Link href="https://www.nav.no/start/soknad-kontantstotte/en">
                                Send the application on PDF/paper
                            </Link>
                        </BodyShort>
                    </div>
                </VStack>
            </Page.Block>
        </main>
    );
}
