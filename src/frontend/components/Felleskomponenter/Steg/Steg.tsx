import React, { ReactNode, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Box, GuidePanel, Heading, FormProgress } from '@navikt/ds-react';
import { ISkjema } from '@navikt/familie-skjema';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { useApp } from '../../../context/AppContext';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { useSteg } from '../../../context/StegContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { device } from '../../../Theme';
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
import { useFormProgressSteg } from './useFormProgressSteg';

interface ISteg {
    tittel: ReactNode;
    guide?: ReactNode;
    skjema?: {
        validerFelterOgVisFeilmelding: () => boolean;
        valideringErOk: () => boolean;
        skjema: ISkjema<SkjemaFeltTyper, string>;
        settSøknadsdataCallback: () => void;
    };
    gåVidereCallback?: () => Promise<boolean>;
    children?: ReactNode;
}

const FormProgressContainer = styled.div`
    max-width: var(--innhold-bredde);
    margin: 0 auto;

    @media all and ${device.tablet} {
        max-width: 100%;
        margin: 0 var(--a-spacing-8);
    }
`;

const ChildrenContainer = styled.div`
    margin-bottom: 2rem;
`;

const Form = styled.form`
    width: 100%;
`;

function Steg({ tittel, guide, skjema, gåVidereCallback, children }: ISteg) {
    const navigate = useNavigate();
    const { erÅpen: erModellVersjonModalÅpen, åpneModal: åpneModellVersjonModal } = useModal();
    const {
        tekster,
        plainTekst,
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
        erPåKvitteringsside,
    } = useSteg();
    const { komFra, settKomFra } = useAppNavigation();
    const { toggles } = useFeatureToggles();

    const nesteRoute = hentNesteSteg();
    const forrigeRoute = hentForrigeSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();
    const formProgressSteg = useFormProgressSteg();

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
        skjulSpråkvelger();
    }, []);

    useEffect(() => {
        modellVersjonOppdatert && !erModellVersjonModalÅpen && åpneModellVersjonModal();
    }, [modellVersjonOppdatert]);

    const skjulSpråkvelger = () => {
        setAvailableLanguages([]).then();
    };

    const håndterAvbryt = () => {
        gåTilbakeTilStart();
        navigate('/');
    };

    const gåVidere = () => {
        if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
            settSisteUtfylteStegIndex(nåværendeStegIndex);
        }
        const målPath = komFra?.path ?? nesteRoute.path;
        komFra && settKomFra(undefined);
        logSkjemaStegFullført(hentNåværendeStegIndex() + 1);
        navigate(målPath);
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
        navigate(forrigeRoute.path);
    };

    const håndterGåTilSteg = (stegIndex: number) => {
        const steg = formProgressSteg[stegIndex];
        navigate(steg.path);
    };

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const formProgressStegOppsummeringTekst = `${plainTekst(frittståendeOrdTekster.steg)} ${hentNåværendeStegIndex()} ${plainTekst(frittståendeOrdTekster.av)} ${formProgressSteg.length}`;

    return (
        <>
            <ScrollHandler />
            <header>
                <Banner />
                {nyesteNåværendeRoute !== RouteEnum.Kvittering && (
                    <FormProgressContainer>
                        <FormProgress
                            translations={{
                                step: formProgressStegOppsummeringTekst,
                                showAllSteps: plainTekst(frittståendeOrdTekster.visAlleSteg),
                                hideAllSteps: plainTekst(frittståendeOrdTekster.skjulAlleSteg),
                            }}
                            totalSteps={formProgressSteg.length}
                            activeStep={hentNåværendeStegIndex()}
                            onStepChange={stegIndex => håndterGåTilSteg(stegIndex - 1)}
                        >
                            {formProgressSteg.map((value, index) => (
                                <FormProgress.Step
                                    key={index}
                                    completed={index + 1 < hentNåværendeStegIndex()}
                                    interactive={index + 1 < hentNåværendeStegIndex()}
                                >
                                    {value.tittel}
                                </FormProgress.Step>
                            ))}
                        </FormProgress>
                    </FormProgressContainer>
                )}
            </header>
            <InnholdContainer>
                <Box marginBlock="16 12" marginInline="auto" id={'stegHovedtittel'} tabIndex={-1}>
                    <Heading level="2" size={'large'} align="center">
                        {tittel}
                    </Heading>
                </Box>
                {toggles.VIS_GUIDE_I_STEG && guide && (
                    <Box marginBlock="0 12">
                        <GuidePanel poster>{guide}</GuidePanel>
                    </Box>
                )}
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
                {erModellVersjonModalÅpen && (
                    <ModellVersjonModal erÅpen={erModellVersjonModalÅpen} />
                )}
            </InnholdContainer>
        </>
    );
}

export default Steg;
