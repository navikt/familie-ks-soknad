import React from 'react';

import styled from 'styled-components';

import { Alert, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import Barnekort from './Barnekort/Barnekort';
import { IVelgBarnTekstinnhold } from './innholdTyper';
import LeggTilBarnModal from './LeggTilBarn/LeggTilBarnModal';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { VelgBarnSpørsmålId } from './spørsmål';
import { useVelgBarn } from './useVelgBarn';

const LenkeContainer = styled.div`
    margin-top: 1.5rem;
`;

const StyledWarningAlert = styled(Alert)`
    margin-top: 1.5rem;
`;

const VelgBarn: React.FC = () => {
    const { søknad, tekster } = useApp();
    const {
        lukkModal: lukkLeggTilBarnModal,
        åpneModal: åpneLeggTilBarnModal,
        erÅpen: erLeggTilBarnModalÅpen,
    } = useModal();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        håndterVelgBarnToggle,
        barnSomSkalVæreMed,
        fjernBarn,
    } = useVelgBarn();

    const barnFraRespons = søknad.søker.barn;
    const barnManueltLagtTil = søknad.barnRegistrertManuelt;
    const barn = barnFraRespons.concat(barnManueltLagtTil);
    const finnesBarnUnder1År = barnSomSkalVæreMed.some(barn => barn.erUnder11Mnd);

    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];
    const {
        velgBarnTittel,
        hvisOpplysningeneIkkeStemmer,
        leseMerOmRegleneKontantstoette,
        kanIkkeBestemmeRettUnder1Aar,
    } = teksterForSteg;

    return (
        <>
            <Steg
                tittel={<TekstBlock block={velgBarnTittel} typografi={Typografi.StegHeadingH1} />}
                skjema={{
                    validerFelterOgVisFeilmelding,
                    valideringErOk,
                    skjema,
                    settSøknadsdataCallback: () => {
                        oppdaterSøknad();
                    },
                }}
            >
                <Alert variant={'info'} inline>
                    <TekstBlock
                        block={hvisOpplysningeneIkkeStemmer}
                        typografi={Typografi.BodyShort}
                    />
                </Alert>

                <VStack
                    id={VelgBarnSpørsmålId.velgBarn}
                    className={'BarnekortStack'}
                    marginBlock="12"
                    gap="12"
                >
                    {barn.map(barnet => (
                        <Barnekort
                            key={barnet.id}
                            barn={barnet}
                            velgBarnCallback={håndterVelgBarnToggle}
                            barnSomSkalVæreMed={barnSomSkalVæreMed}
                            fjernBarnCallback={fjernBarn}
                        />
                    ))}
                    <NyttBarnKort onLeggTilBarn={åpneLeggTilBarnModal} />
                </VStack>

                {finnesBarnUnder1År && (
                    <StyledWarningAlert inline variant={'warning'}>
                        <TekstBlock block={kanIkkeBestemmeRettUnder1Aar} />
                    </StyledWarningAlert>
                )}

                <LenkeContainer>
                    <TekstBlock block={leseMerOmRegleneKontantstoette} />
                </LenkeContainer>
            </Steg>
            {erLeggTilBarnModalÅpen && (
                <LeggTilBarnModal
                    erÅpen={erLeggTilBarnModalÅpen}
                    lukkModal={lukkLeggTilBarnModal}
                />
            )}
        </>
    );
};

export default VelgBarn;
