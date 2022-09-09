import React from 'react';

import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledBekreftCheckboksPanel = styled(BekreftCheckboksPanel)<{ status: BekreftelseStatus }>`
    && {
        border: 1px solid ${props => bekreftelseBoksBorderFarge(props.status)};
        padding: 1.5rem;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }
`;

const StyledButton = styled(Button)`
    && {
        margin: 2.3rem auto 0 auto;
    }
`;

export const bekreftelseBoksBorderFarge = (status: BekreftelseStatus) => {
    switch (status) {
        case BekreftelseStatus.BEKREFTET:
            return navFarger.navGronn;
        case BekreftelseStatus.FEIL:
            return navFarger.navRod;
        default:
            return navFarger.navOransje;
    }
};

const BekreftelseOgStartSoknad: React.FC = () => {
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();
    const { localeString, tekster } = useApp();

    const {
        bekreftelsesboksFeilmelding,
        bekreftelsesboksBroedtekst,
        bekreftelsesboksErklaering,
        bekreftelsesboksTittel,
    } = tekster()[ESanitySteg.FORSIDE];

    return (
        <FormContainer onSubmit={event => onStartSøknad(event)}>
            <Informasjonsbolk tittel={localeString(bekreftelsesboksTittel)}>
                <StyledBekreftCheckboksPanel
                    label={localeString(bekreftelsesboksErklaering)}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    feil={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>{localeString(bekreftelsesboksFeilmelding)}</span>
                        )
                    }
                    status={bekreftelseStatus}
                >
                    <TekstBlock block={bekreftelsesboksBroedtekst} />
                </StyledBekreftCheckboksPanel>
            </Informasjonsbolk>

            <StyledButton
                variant={
                    bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'
                }
                type={'submit'}
            >
                <SpråkTekst id="forside.start-soknad.knapp" />
            </StyledButton>
        </FormContainer>
    );
};

export default BekreftelseOgStartSoknad;
