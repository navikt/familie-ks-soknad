import React from 'react';

import Masonry from 'react-masonry-css';
import styled from 'styled-components';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import LeggTilBarnModal from './LeggTilBarn/LeggTilBarnModal';
import { NyttBarnKort } from './LeggTilBarn/NyttBarnKort';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from './spørsmål';
import { useVelgBarn } from './useVelgBarn';

/**
 * Vi har prøvd mye for å få til masonry, men før denne teknologien blir implementert
 * av nettlesere ser det ut til at javascript må til for å få godt pakka barnekortkontainer.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout
 */
const BarnekortContainer = styled(Masonry)`
    display: flex;
    margin-top: 5rem;
`;
const LenkeContainer = styled.div`
    margin-top: 1.5rem;
`;

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();
    const { toggleModal, erÅpen } = useModal();
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

    return (
        <>
            <Steg
                tittel={<SpråkTekst id={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.velgBarn]} />}
                skjema={{
                    validerFelterOgVisFeilmelding,
                    valideringErOk,
                    skjema,
                    settSøknadsdataCallback: () => {
                        oppdaterSøknad();
                    },
                }}
            >
                <AlertStripe variant={'info'}>
                    <SpråkTekst id={'hvilkebarn.info.alert'} />
                    <EksternLenke
                        lenkeSpråkId={'hvilkebarn.endre-opplysninger.lenke'}
                        lenkeTekstSpråkId={'hvilkebarn.endre-opplysninger.lenketekst'}
                        target="_blank"
                    />
                </AlertStripe>

                <BarnekortContainer
                    id={VelgBarnSpørsmålId.velgBarn}
                    className={'BarnekortContainer'}
                    breakpointCols={{
                        default: 2,
                        480: 1,
                    }}
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
                    <NyttBarnKort onLeggTilBarn={toggleModal} />
                </BarnekortContainer>
                <LenkeContainer>
                    <EksternLenke
                        lenkeSpråkId={'hvilkebarn.regelverk.lenke'}
                        lenkeTekstSpråkId={'hvilkebarn.regelverk.lenketekst'}
                        target="_blank"
                    />
                </LenkeContainer>
            </Steg>
            <LeggTilBarnModal erÅpen={erÅpen} toggleModal={toggleModal} />
        </>
    );
};

export default VelgBarn;
