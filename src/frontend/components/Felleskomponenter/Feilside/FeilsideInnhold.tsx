import React, { FC } from 'react';

import { BodyShort, Button, Heading, Link } from '@navikt/ds-react';

import { useSpråkContext } from '../../../context/SpråkContext';
import { LocaleType } from '../../../typer/common';

export const FeilsideInnhold: FC = () => {
    const { valgtLocale } = useSpråkContext();

    const lastInnSidenPåNytt = () => {
        window.location.reload();
    };

    const gåTilbakeTilForrigeSide = () => {
        history.back();
    };

    return (
        <>
            {valgtLocale === LocaleType.nb && (
                <>
                    <Heading level="1" size="large" spacing>
                        Beklager, noe gikk galt.
                    </Heading>
                    <BodyShort spacing>
                        En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du
                        gjorde.
                    </BodyShort>
                    <BodyShort spacing>
                        Du kan prøve å vente noen minutter og{' '}
                        <Button variant="secondary" size="small" onClick={lastInnSidenPåNytt}>
                            laste inn siden på nytt
                        </Button>{' '}
                        eller{' '}
                        <Button variant="secondary" size="small" onClick={gåTilbakeTilForrigeSide}>
                            gå tilbake til forrige side
                        </Button>
                        .
                    </BodyShort>
                    <BodyShort>
                        Hvis problemet vedvarer, kan du{' '}
                        <Link href="https://www.nav.no/start/soknad-kontantstotte" target="_blank">
                            laste ned og sende papirsøknad (åpnes i nytt vindu)
                        </Link>
                        .
                    </BodyShort>
                </>
            )}

            {valgtLocale === LocaleType.nn && (
                <>
                    <Heading level="1" size="large" spacing>
                        Beklager, noe gikk galt.
                    </Heading>
                    <BodyShort spacing>
                        Ein teknisk feil på våre servere gjer at sida er utilgjengeleg. Dette skuldast ikkje noko du
                        gjorde.
                    </BodyShort>
                    <BodyShort spacing>
                        Du kan prøve å vente nokre minutt og{' '}
                        <Button variant="secondary" size="small" onClick={lastInnSidenPåNytt}>
                            laste sida på nytt
                        </Button>{' '}
                        eller{' '}
                        <Button variant="secondary" size="small" onClick={gåTilbakeTilForrigeSide}>
                            gå tilbake til førre side
                        </Button>
                        .
                    </BodyShort>
                    <BodyShort>
                        Viss problemet held fram, kan du{' '}
                        <Link href="https://www.nav.no/start/soknad-kontantstotte/nn" target="_blank">
                            lasta ned og senda papirsøknad (blir opna i nytt vindauge)
                        </Link>
                        .
                    </BodyShort>
                </>
            )}

            {valgtLocale === LocaleType.en && (
                <>
                    <Heading level="1" size="large" spacing>
                        Something went wrong
                    </Heading>
                    <BodyShort spacing>
                        A technical error on our servers has made the page unavailable. This is not your fault.
                    </BodyShort>
                    <BodyShort spacing>
                        You can try to wait a few minutes and{' '}
                        <Button variant="secondary" size="small" onClick={lastInnSidenPåNytt}>
                            reload the page
                        </Button>{' '}
                        or{' '}
                        <Button variant="secondary" size="small" onClick={gåTilbakeTilForrigeSide}>
                            go back to the previous page
                        </Button>
                        .
                    </BodyShort>
                    <BodyShort>
                        If the problem persists, you can{' '}
                        <Link href="https://www.nav.no/start/soknad-kontantstotte/en" target="_blank">
                            download and send a paper form (opens in a new window)
                        </Link>
                        .
                    </BodyShort>
                </>
            )}
        </>
    );
};
