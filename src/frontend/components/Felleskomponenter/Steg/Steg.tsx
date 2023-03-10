import React, { ReactNode, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Stepper } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { useSteg } from '../../../context/StegContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { RouteEnum } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import {
    logKlikkGåVidere,
    logSidevisningKontantstøtte,
    logSkjemaStegFullført,
} from '../../../utils/amplitude';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Banner from '../Banner/Banner';
import InnholdContainer from '../InnholdContainer/InnholdContainer';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import useModal from '../SkjemaModal/useModal';
import ModellVersjonModal from './ModellVersjonModal';
import Navigeringspanel from './Navigeringspanel';
import { ScrollHandler } from './ScrollHandler';

interface ISteg {
    tittel: ReactNode;
    skjema?: {
        validerFelterOgVisFeilmelding: () => boolean;
        valideringErOk: () => boolean;
        skjema: ISkjema<SkjemaFeltTyper, string>;
        settSøknadsdataCallback: () => void;
    };
    gåVidereCallback?: () => Promise<boolean>;
}

const ChildrenContainer = styled.div`
    margin-bottom: 2rem;
`;

const TittelContainer = styled.div`
    && {
        margin: 4rem auto 3rem auto;

        :focus-visible {
            outline: none;
        }
    }
`;

const Form = styled.form`
    width: 100%;
`;

const StegindikatorContainer = styled.div`
    margin: 0 1rem;
    text-align: center;
`;

const StyledStepper = styled(Stepper)`
    display: inline-flex;
    --navds-stepper-circle-size: 2.125rem;
    --navds-stepper-border-width: 1px;
    > li {
        gap: 0;
    }
`;

const StyledStepperStep = styled(Stepper.Step)``;

const Steg: React.FC<ISteg> = ({ tittel, skjema, gåVidereCallback, children }) => {
    const history = useHistory();
    const { erÅpen: erModellVersjonModalÅpen, toggleModal: toggleModellVersjonModal } = useModal();
    const {
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        gåTilbakeTilStart,
        settNåværendeRoute,
        modellVersjonOppdatert,
    } = useApp();
    const {
        hentNesteSteg,
        hentForrigeSteg,
        hentNåværendeSteg,
        hentNåværendeStegIndex,
        stegIndikatorObjekter,
        erPåKvitteringsside,
    } = useSteg();
    const { komFra, settKomFra } = useAppNavigation();

    const [aktivtSteg, settAktivtSteg] = useState(hentNåværendeStegIndex());

    const nesteRoute = hentNesteSteg();
    const forrigeRoute = hentForrigeSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();

    const nyesteNåværendeRoute: RouteEnum = hentNåværendeSteg().route;
    useFørsteRender(() => logSidevisningKontantstøtte(nyesteNåværendeRoute));

    useEffect(() => {
        window.scrollTo(0, 0);
        document.getElementById('stegHovedtittel')?.focus();
        settNåværendeRoute(nyesteNåværendeRoute);
        if (skjema && erStegUtfyltFrafør(nåværendeStegIndex)) {
            Object.values(skjema.skjema.felter).forEach(felt => {
                felt.validerOgSettFelt(felt.verdi);
            });
        }
    }, []);

    useEffect(() => {
        modellVersjonOppdatert && !erModellVersjonModalÅpen && toggleModellVersjonModal();
    }, [modellVersjonOppdatert]);

    const håndterAvbryt = () => {
        gåTilbakeTilStart();
        history.push('/');
    };

    const gåVidere = () => {
        if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
            settSisteUtfylteStegIndex(nåværendeStegIndex);
        }
        const målPath = komFra?.path ?? nesteRoute.path;
        komFra && settKomFra(undefined);
        logSkjemaStegFullført(hentNåværendeStegIndex() + 1);
        history.push(målPath);
    };

    const håndterGåVidere = event => {
        event.preventDefault();
        logKlikkGåVidere(hentNåværendeStegIndex() + 1);
        if (skjema) {
            if (skjema.validerFelterOgVisFeilmelding()) {
                skjema.settSøknadsdataCallback();
                gåVidere();
            }
        } else if (gåVidereCallback) {
            gåVidereCallback().then(resultat => resultat && gåVidere());
        } else {
            gåVidere();
        }
    };

    const håndterTilbake = () => {
        history.push(forrigeRoute.path);
    };

    return (
        <>
            <ScrollHandler />
            <header>
                <Banner />
                {nyesteNåværendeRoute !== RouteEnum.Kvittering && (
                    <StegindikatorContainer>
                        <StyledStepper
                            aria-labelledby="Søknadssteg"
                            activeStep={aktivtSteg}
                            onStepChange={x => settAktivtSteg(x)}
                            orientation="horizontal"
                            interactive={false}
                        >
                            {stegIndikatorObjekter.map(value => (
                                <StyledStepperStep
                                    href="#"
                                    children={''}
                                    title={value.label}
                                    key={value.key}
                                />
                            ))}
                        </StyledStepper>
                    </StegindikatorContainer>
                )}
            </header>
            <InnholdContainer>
                <TittelContainer id={'stegHovedtittel'} tabIndex={-1}>
                    {tittel}
                </TittelContainer>
                <Form onSubmit={event => håndterGåVidere(event)} autoComplete="off">
                    <ChildrenContainer>{children}</ChildrenContainer>
                    {skjema && visFeiloppsummering(skjema.skjema) && (
                        <SkjemaFeiloppsummering skjema={skjema.skjema} />
                    )}
                    {!erPåKvitteringsside() && (
                        <Navigeringspanel
                            onTilbakeCallback={håndterTilbake}
                            onAvbrytCallback={håndterAvbryt}
                            valideringErOk={skjema && skjema.valideringErOk}
                        />
                    )}
                </Form>
                <ModellVersjonModal erÅpen={erModellVersjonModalÅpen} />
            </InnholdContainer>
        </>
    );
};

export default Steg;
