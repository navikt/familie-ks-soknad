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
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { logSidevisningKontantstøtte } from '../../../utils/amplitude';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

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

    const {
        [ESanitySteg.FORSIDE]: {
            veilederHei,
            veilederhilsen,
            soeknadstittel,
            foerDuSoekerTittel,
            foerDuSoeker,
            informasjonOmPlikterTittel,
            informasjonOmPlikter,
            informasjonOmPersonopplysningerTittel,
            informasjonOmPersonopplysninger,
        },
    } = tekster();

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
                    {plainTekst(soeknadstittel)}
                </Heading>
                <GuidePanel poster>
                    <Heading level="2" size="medium" spacing>
                        {plainTekst(veilederHei)}
                    </Heading>
                    <TekstBlock block={veilederhilsen} typografi={Typografi.BodyLong} />
                </GuidePanel>
                <div>
                    <Heading level="2" size="large" spacing>
                        {plainTekst(foerDuSoekerTittel)}
                    </Heading>
                    <TekstBlock block={foerDuSoeker} typografi={Typografi.BodyLong} />
                </div>
                <Accordion>
                    <Accordion.Item>
                        <Accordion.Header>
                            {plainTekst(informasjonOmPlikterTittel)}
                        </Accordion.Header>
                        <Accordion.Content>
                            <TekstBlock block={informasjonOmPlikter} />
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>
                            {plainTekst(informasjonOmPersonopplysningerTittel)}
                        </Accordion.Header>
                        <Accordion.Content>
                            <TekstBlock block={informasjonOmPersonopplysninger} />
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>
                            {/* {plainTekst(informasjonOmLagringAvSvarTittel)} */}
                            informasjonOmLagringAvSvarTittel
                        </Accordion.Header>
                        <Accordion.Content>
                            {/* <TekstBlock block={informasjonOmLagringAvSvar} /> */}
                            informasjonOmLagringAvSvar
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>

                {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}
            </VStack>
        </Layout>
    );
};

export default Forside;
