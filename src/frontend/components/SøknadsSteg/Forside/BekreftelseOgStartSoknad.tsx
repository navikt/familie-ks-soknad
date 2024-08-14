import React from 'react';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, ConfirmationPanel, VStack } from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
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
                <Informasjonsbolk
                    tittel={plainTekst(bekreftelsesboksTittel)}
                    data-testid={'bekreftelsesboks-container'}
                >
                    <ConfirmationPanel
                        label={plainTekst(bekreftelsesboksErklaering)}
                        onChange={bekreftelseOnChange}
                        checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                        error={
                            bekreftelseStatus === BekreftelseStatus.FEIL && (
                                <span role={'alert'}>
                                    {plainTekst(bekreftelsesboksFeilmelding)}
                                </span>
                            )
                        }
                    >
                        <TekstBlock
                            block={bekreftelsesboksBroedtekst}
                            typografi={Typografi.BodyLong}
                        />
                    </ConfirmationPanel>
                </Informasjonsbolk>
                <VStack gap="8" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button
                        variant={
                            bekreftelseStatus === BekreftelseStatus.BEKREFTET
                                ? 'primary'
                                : 'secondary'
                        }
                        type={'submit'}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                    >
                        {plainTekst(navigasjon.startKnapp)}
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;
