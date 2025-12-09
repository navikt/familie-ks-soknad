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
                        <BodyShort>
                            Denne siden er midlertidig utilgjengelig mens vi legger til nytt innhold og gjør
                            forbedringer. Takk for tålmodigheten. Prøv gjerne igjen litt senere, eller{' '}
                            <Link href="https://www.nav.no/start/soknad-kontantstotte" inlineText>
                                bruk skjema for innsending i posten
                            </Link>
                            .
                        </BodyShort>
                    </div>
                    <div>
                        <Heading level="1" size="large" spacing>
                            We’re working on this page
                        </Heading>
                        <BodyShort>
                            This page is temporarily unavailable while we add new content and improvements. Thank you
                            for your patience. Please check back a little later, or you can use{' '}
                            <Link href="https://www.nav.no/start/soknad-kontantstotte/en" inlineText>
                                the application form for submission by post
                            </Link>
                            .
                        </BodyShort>
                    </div>
                </VStack>
            </Page.Block>
        </main>
    );
}
