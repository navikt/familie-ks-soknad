import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { BodyShort, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import Steg from '../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import DinLivssituasjonOppsummering from './OppsummeringSteg/DinLivssituasjonOppsummering';
import EøsBarnOppsummering from './OppsummeringSteg/Eøs/EøsBarnOppsummering';
import EøsSøkerOppsummering from './OppsummeringSteg/Eøs/EøsSøkerOppsummering';
import OmBarnaOppsummering from './OppsummeringSteg/OmBarnaOppsummering';
import OmBarnetOppsummering from './OppsummeringSteg/OmBarnet/OmBarnetOppsummering';
import OmDegOppsummering from './OppsummeringSteg/OmDegOppsummering';
import VelgBarnOppsummering from './OppsummeringSteg/VelgBarnOppsummering';

const Oppsummering: React.FC = () => {
    const { søknad, tekster, plainTekst } = useApp();
    const { toggles } = useFeatureToggles();
    const navigate = useNavigate();
    const [feilAnchors, settFeilAnchors] = useState<string[]>([]);
    const { barnSomTriggerEøs, søkerTriggerEøs } = useEøs();
    const søkerHarEøsSteg = søkerTriggerEøs || !!barnSomTriggerEøs.length;
    const barnSomHarEøsSteg: IBarnMedISøknad[] = søkerTriggerEøs
        ? søknad.barnInkludertISøknaden
        : søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs);

    const {
        [ESanitySteg.OPPSUMMERING]: { oppsummeringTittel, oppsummeringGuide, lesNoeye },
    } = tekster();

    const scrollTilFeil = (elementId: string) => {
        // Gjør dette for syns skyld, men push scroller ikke vinduet
        navigate({ hash: elementId });
        const element = document.getElementById(elementId);
        element && element.scrollIntoView();
    };

    const gåVidereCallback = (): Promise<boolean> => {
        feilAnchors[0] && scrollTilFeil(feilAnchors[0]);
        return Promise.resolve(feilAnchors.length === 0);
    };

    return (
        <Steg
            tittel={<TekstBlock block={oppsummeringTittel} />}
            guide={<TekstBlock block={oppsummeringGuide} />}
            gåVidereCallback={gåVidereCallback}
        >
            <VStack gap="12">
                {!toggles.VIS_GUIDE_I_STEG && <BodyShort>{plainTekst(lesNoeye)}</BodyShort>}

                <OmDegOppsummering settFeilAnchors={settFeilAnchors} />
                <DinLivssituasjonOppsummering settFeilAnchors={settFeilAnchors} />
                <VelgBarnOppsummering settFeilAnchors={settFeilAnchors} />
                <OmBarnaOppsummering settFeilAnchors={settFeilAnchors} />

                {søknad.barnInkludertISøknaden.map((barn, index) => {
                    return (
                        <OmBarnetOppsummering
                            key={`om-barnet-${index}`}
                            barn={barn}
                            settFeilAnchors={settFeilAnchors}
                            index={index}
                        />
                    );
                })}

                <>
                    {søkerHarEøsSteg && <EøsSøkerOppsummering settFeilAnchors={settFeilAnchors} />}
                    {barnSomHarEøsSteg.map((barn, index) => {
                        return (
                            <EøsBarnOppsummering
                                key={`om-barnet-eøs-${index}`}
                                settFeilAnchors={settFeilAnchors}
                                barn={barn}
                            />
                        );
                    })}
                </>
            </VStack>
        </Steg>
    );
};

export default Oppsummering;
