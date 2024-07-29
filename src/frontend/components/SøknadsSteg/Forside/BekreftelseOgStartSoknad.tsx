import React from 'react';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Box, Button, ConfirmationPanel, Heading, VStack } from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

export const bekreftelseBoksBorderFarge = (status: BekreftelseStatus) => {
    switch (status) {
        case BekreftelseStatus.BEKREFTET:
            return AGreen500;
        case BekreftelseStatus.FEIL:
            return ANavRed;
        default:
            return AOrange500;
    }
};

const BekreftelseOgStartSoknad: React.FC = () => {
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();
    const { plainTekst, tekster } = useApp();

    const {
        FORSIDE: {
            bekreftelsesboksFeilmelding,
            bekreftelsesboksBroedtekst,
            bekreftelsesboksErklaering,
            bekreftelsesboksTittel,
        },
        FELLES: { navigasjon },
    } = tekster();

    return (
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap="12">
                <ConfirmationPanel
                    label={plainTekst(bekreftelsesboksErklaering)}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    error={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>{plainTekst(bekreftelsesboksFeilmelding)}</span>
                        )
                    }
                >
                    <Heading level="2" size="xsmall" spacing>
                        {plainTekst(bekreftelsesboksTittel)}
                    </Heading>
                    <TekstBlock block={bekreftelsesboksBroedtekst} typografi={Typografi.BodyLong} />
                </ConfirmationPanel>

                <Box marginInline="auto">
                    <Button
                        variant={
                            bekreftelseStatus === BekreftelseStatus.BEKREFTET
                                ? 'primary'
                                : 'secondary'
                        }
                        type={'submit'}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        data-testid={'start-søknad-knapp'}
                    >
                        {plainTekst(navigasjon.startKnapp)}
                    </Button>
                </Box>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;
