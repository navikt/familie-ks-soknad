import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Accordion, GuidePanel, Heading, VStack } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import Miljø from '../../../../shared-utils/Miljø';
import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { device } from '../../../Theme';
import { Typografi } from '../../../typer/common';
import { RouteEnum } from '../../../typer/routes';
import { logSidevisningKontantstøtte } from '../../../utils/amplitude';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import { FortsettPåSøknad } from './FortsettPåSøknad';

const Layout = styled.div`
    max-width: var(--innhold-bredde);
    margin: 2rem auto 4rem auto;

    @media all and ${device.tablet} {
        max-width: 100%;
        margin: 2rem 2rem 4rem 2rem;
    }
`;

const Forside: React.FC = () => {
    const { mellomlagretVerdi, settNåværendeRoute, tekster, plainTekst } = useApp();

    // const forsidetekster = tekster().FORSIDE;
    const midlertidigeTekster = tekster().FELLES.midlertidigeTekster;

    useFørsteRender(() => logSidevisningKontantstøtte(`${RouteEnum.Forside}`));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
        visSpråkvelger();
    }, []);

    const visSpråkvelger = () => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]).then();
    };

    const kanFortsettePåSøknad =
        mellomlagretVerdi && mellomlagretVerdi.modellVersjon === Miljø().modellVersjon;

    return (
        <Layout>
            <VStack gap="12">
                <Heading level="1" size="large" align="center">
                    {/* {plainTekst(forsidetekster.soeknadstittel)} */}
                    {plainTekst(midlertidigeTekster.forsideSoeknadstittel)}
                </Heading>
                <GuidePanel poster>
                    <Heading level="2" size="medium" spacing>
                        {/* {plainTekst(forsidetekster.veilederHei)} */}
                        {plainTekst(midlertidigeTekster.forsideVeilederHei)}
                    </Heading>
                    <TekstBlock
                        // block={forsidetekster.veilederIntro}
                        block={midlertidigeTekster.forsideVeilederIntro}
                        typografi={Typografi.BodyLong}
                    />
                </GuidePanel>
                <div>
                    <Heading level="2" size="large" spacing>
                        {/* {plainTekst(forsidetekster.foerDuSoekerTittel)} */}
                        {plainTekst(midlertidigeTekster.forsideFoerDuSoekerTittel)}
                    </Heading>
                    <TekstBlock
                        // block={forsidetekster.foerDuSoeker}
                        block={midlertidigeTekster.forsideFoerDuSoeker}
                        typografi={Typografi.BodyLong}
                    />
                </div>
                <Accordion>
                    <Accordion.Item>
                        <Accordion.Header>
                            {/* {plainTekst(forsidetekster.informasjonOmPlikterTittel)} */}
                            {plainTekst(midlertidigeTekster.forsideInformasjonOmPlikterTittel)}
                        </Accordion.Header>
                        <Accordion.Content>
                            {/* <TekstBlock block={forsidetekster.informasjonOmPlikter} /> */}
                            <TekstBlock
                                block={midlertidigeTekster.forsideInformasjonOmPlikter}
                                typografi={Typografi.BodyLong}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>
                            {/* {plainTekst(forsidetekster.informasjonOmPersonopplysningerTittel)} */}
                            {plainTekst(
                                midlertidigeTekster.forsideInformasjonOmPersonopplysningerTittel
                            )}
                        </Accordion.Header>
                        <Accordion.Content>
                            {/* <TekstBlock block={forsidetekster.informasjonOmPersonopplysninger} /> */}
                            <TekstBlock
                                block={midlertidigeTekster.forsideInformasjonOmPersonopplysninger}
                                typografi={Typografi.BodyLong}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>
                            {/* {plainTekst(forsidetekster.informasjonOmLagringAvSvarTittel)} */}
                            {plainTekst(
                                midlertidigeTekster.forsideInformasjonOmLagringAvSvarTittel
                            )}
                        </Accordion.Header>
                        <Accordion.Content>
                            {/* <TekstBlock block={forsidetekster.informasjonOmLagringAvSvar} /> */}
                            <TekstBlock
                                block={midlertidigeTekster.forsideInformasjonOmLagringAvSvar}
                                typografi={Typografi.BodyLong}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>

                {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}
            </VStack>
        </Layout>
    );
};

export default Forside;
