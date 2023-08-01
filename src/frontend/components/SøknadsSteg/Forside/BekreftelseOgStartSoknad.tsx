import React from 'react';

import styled from 'styled-components';

import { Button, ConfirmationPanel } from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';
import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledButton = styled(Button)`
    && {
        margin: 2.3rem auto 0 auto;
    }
`;

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
        <FormContainer onSubmit={event => onStartSøknad(event)}>
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
                            <span role={'alert'}>{plainTekst(bekreftelsesboksFeilmelding)}</span>
                        )
                    }
                >
                    <TekstBlock block={bekreftelsesboksBroedtekst} typografi={Typografi.BodyLong} />
                </ConfirmationPanel>
            </Informasjonsbolk>

            <StyledButton
                variant={
                    bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'
                }
                type={'submit'}
                data-testid={'start-søknad-knapp'}
            >
                {plainTekst(navigasjon.startKnapp)}
            </StyledButton>
        </FormContainer>
    );
};

export default BekreftelseOgStartSoknad;
