import React from 'react';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, ErrorMessage, InfoCard, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const BekreftelseOgStartSoknad: React.FC = () => {
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();
    const { plainTekst, tekster } = useAppContext();

    const forsidetekster = tekster().FORSIDE;
    const navigasjonTekster = tekster().FELLES.navigasjon;

    const bekreftelseKortStatus = () => {
        switch (bekreftelseStatus) {
            case BekreftelseStatus.BEKREFTET:
                return 'success';
            case BekreftelseStatus.FEIL:
                return 'danger';
            case BekreftelseStatus.NORMAL:
            default:
                return 'warning';
        }
    };

    return (
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap={'space-8'}>
                <InfoCard data-color={bekreftelseKortStatus()}>
                    <InfoCard.Header>
                        <InfoCard.Title>{plainTekst(forsidetekster.bekreftelsesboksTittel)}</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>
                        <TekstBlock block={forsidetekster.bekreftelsesboksBroedtekst} typografi={Typografi.BodyLong} />
                        <Checkbox
                            value={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                            onChange={bekreftelseOnChange}
                        >
                            {plainTekst(forsidetekster.bekreftelsesboksErklaering)}
                        </Checkbox>
                    </InfoCard.Content>
                </InfoCard>
                {bekreftelseStatus === BekreftelseStatus.FEIL && (
                    <ErrorMessage showIcon>{plainTekst(forsidetekster.bekreftelsesboksFeilmelding)}</ErrorMessage>
                )}
            </VStack>
            <VStack marginBlock="space-48 space-0" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
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
        </form>
    );
};

export default BekreftelseOgStartSoknad;
