import { useTranslate } from '@hooks/useTranslate';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, ErrorMessage, InfoCard, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useSanityTekster } from '../../../context/SanityContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const BekreftelseOgStartSoknad: FC = () => {
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();

    const forsidetekster = useSanityTekster(ESanitySteg.FORSIDE);
    const fellestekster = useSanityTekster(ESanitySteg.FELLES);
    const translate = useTranslate();

    const bekreftelseKortStatus = () => {
        switch (bekreftelseStatus) {
            case BekreftelseStatus.BEKREFTET:
                return 'success';
            case BekreftelseStatus.FEIL:
                return 'danger';
            default:
                return 'warning';
        }
    };

    return (
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap={'space-8'}>
                <InfoCard data-color={bekreftelseKortStatus()}>
                    <InfoCard.Header>
                        <InfoCard.Title>{translate(forsidetekster.bekreftelsesboksTittel)}</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>
                        <TekstBlock block={forsidetekster.bekreftelsesboksBroedtekst} typografi={Typografi.BodyLong} />
                        <Checkbox
                            value={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                            onChange={bekreftelseOnChange}
                        >
                            {translate(forsidetekster.bekreftelsesboksErklaering)}
                        </Checkbox>
                    </InfoCard.Content>
                </InfoCard>
                {bekreftelseStatus === BekreftelseStatus.FEIL && (
                    <ErrorMessage showIcon>{translate(forsidetekster.bekreftelsesboksFeilmelding)}</ErrorMessage>
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
                    {translate(fellestekster.navigasjon.startKnapp)}
                </Button>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;
