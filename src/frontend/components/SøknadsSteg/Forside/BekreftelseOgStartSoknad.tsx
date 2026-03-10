import React from 'react';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, ConfirmationPanel, Heading, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const BekreftelseOgStartSoknad: React.FC = () => {
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();
    const { plainTekst, tekster } = useAppContext();

    const forsidetekster = tekster().FORSIDE;
    const navigasjonTekster = tekster().FELLES.navigasjon;

    return (
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap="space-48">
                <ConfirmationPanel
                    label={plainTekst(forsidetekster.bekreftelsesboksErklaering)}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    error={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>{plainTekst(forsidetekster.bekreftelsesboksFeilmelding)}</span>
                        )
                    }
                >
                    <Heading level="2" size="xsmall" spacing>
                        {plainTekst(forsidetekster.bekreftelsesboksTittel)}
                    </Heading>
                    <TekstBlock block={forsidetekster.bekreftelsesboksBroedtekst} typografi={Typografi.BodyLong} />
                </ConfirmationPanel>

                <VStack gap="space-32" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button
                        variant={bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'}
                        type={'submit'}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        data-testid={'start-søknad-knapp'}
                    >
                        {plainTekst(navigasjonTekster.startKnapp)}
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;
