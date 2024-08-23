import React, { FC } from 'react';

import { BodyShort, Link, List } from '@navikt/ds-react';

import { useSpråk } from '../../../context/SpråkContext';
import { LocaleType } from '../../../typer/common';

import { GåTilBakeTilForrigeSideLenke } from './GåTilbakeTilForrigeSideLenke';
import { LastInnSidenPåNyttLenke } from './LastInnSidenPåNyttLenke';

export const FeilsideInnhold: FC = () => {
    const { valgtLocale } = useSpråk();

    return (
        <>
            {valgtLocale === LocaleType.nb && (
                <>
                    <BodyShort spacing>
                        En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette
                        skyldes ikke noe du gjorde.
                    </BodyShort>
                    <BodyShort>Du kan prøve å</BodyShort>
                    <List>
                        <List.Item>
                            vente noen minutter og{' '}
                            <LastInnSidenPåNyttLenke>laste siden på nytt</LastInnSidenPåNyttLenke>
                        </List.Item>
                        <List.Item>
                            <GåTilBakeTilForrigeSideLenke>
                                gå tilbake til forrige side
                            </GåTilBakeTilForrigeSideLenke>
                        </List.Item>
                    </List>
                    <BodyShort>
                        Hvis problemet vedvarer, kan du{' '}
                        <Link href="https://nav.no/kontaktoss" target="_blank">
                            kontakte oss (åpnes i ny fane)
                        </Link>
                        .
                    </BodyShort>
                </>
            )}

            {valgtLocale === LocaleType.nn && (
                <>
                    <BodyShort spacing>
                        Ein teknisk feil på våre servere gjer at sida er utilgjengeleg. Dette
                        skuldast ikkje noko du gjorde.
                    </BodyShort>
                    <BodyShort>Du kan prøve å</BodyShort>
                    <List>
                        <List.Item>
                            vente nokre minutt og{' '}
                            <LastInnSidenPåNyttLenke>laste sida på nytt</LastInnSidenPåNyttLenke>
                        </List.Item>
                        <List.Item>
                            <GåTilBakeTilForrigeSideLenke>
                                gå tilbake til førre side
                            </GåTilBakeTilForrigeSideLenke>
                        </List.Item>
                    </List>
                    <BodyShort>
                        Viss problemet held fram, kan du{' '}
                        <Link href="https://nav.no/kontaktoss" target="_blank">
                            kontakte oss (blir opna i ny fane)
                        </Link>
                        .
                    </BodyShort>
                </>
            )}

            {valgtLocale === LocaleType.en && (
                <>
                    <BodyShort spacing>
                        A technical error on our servers has made the page unavailable. This is not
                        your fault.
                    </BodyShort>
                    <BodyShort>You can try to</BodyShort>
                    <List>
                        <List.Item>
                            wait a few minutes and{' '}
                            <LastInnSidenPåNyttLenke>reload the page</LastInnSidenPåNyttLenke>
                        </List.Item>
                        <List.Item>
                            <GåTilBakeTilForrigeSideLenke>
                                go back to the previous page
                            </GåTilBakeTilForrigeSideLenke>
                        </List.Item>
                    </List>
                    <BodyShort>
                        If the problem persists, you can{' '}
                        <Link href="https://www.nav.no/kontaktoss/en" target="_blank">
                            contact us (opens in a new tab)
                        </Link>
                        .
                    </BodyShort>
                </>
            )}
        </>
    );
};
