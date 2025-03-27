import React from 'react';

import styled from 'styled-components';

import { ExpansionCard, Heading, HGrid, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import TekstBlock from '../TekstBlock';

import PictureScanningExample from './PictureScanningExample';
import ScanningIcon from './ScanningIcon';

const StyledVStack = styled(VStack)`
    && ul {
        margin: 0;
        li {
            margin-bottom: 0.5rem;
        }
    }
`;

const svgIconHeight = 112;

const PictureScanningGuide = () => {
    const { tekster, plainTekst } = useAppContext();
    const dokumentasjonTekster = tekster().DOKUMENTASJON;

    return (
        <ExpansionCard aria-label={plainTekst(dokumentasjonTekster.slikTarDuEtGodtBildeExpand)}>
            <ExpansionCard.Header>
                <ExpansionCard.Title as="h3" size="small">
                    {plainTekst(dokumentasjonTekster.slikTarDuEtGodtBildeExpand)}
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <StyledVStack gap="8">
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.slikTarDuEtGodtBildeTittel)}
                        </Heading>
                        <TekstBlock block={dokumentasjonTekster.slikTarDuEtGodtBilde} />
                    </div>
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.etterDuHarTattBildetTittel)}
                        </Heading>
                        <TekstBlock block={dokumentasjonTekster.etterDuHarTattBildet} />
                    </div>
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.braOgDaarligeTittel)}
                        </Heading>
                        <HGrid gap="4" columns={{ xs: 1, sm: 2 }}>
                            <PictureScanningExample
                                image={<ScanningIcon status="good" height={svgIconHeight} />}
                                variant="success"
                                statusText={plainTekst(dokumentasjonTekster.bra)}
                                description={plainTekst(dokumentasjonTekster.fyllerHeleBildet)}
                            />
                            <PictureScanningExample
                                image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                                variant="error"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.ikkeTattOvenfra)}
                            />
                            <PictureScanningExample
                                image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                                variant="error"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.ikkeRiktigRetning)}
                            />
                            <PictureScanningExample
                                image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                                variant="error"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.skyggePaaDokumentet)}
                            />
                        </HGrid>
                    </div>
                    <div>
                        <Heading level="4" size="xsmall" spacing>
                            {plainTekst(dokumentasjonTekster.vaerTryggNaarDuTarBildeTittel)}
                        </Heading>
                        <TekstBlock block={dokumentasjonTekster.vaerTryggNaarDuTarBilde} />
                    </div>
                </StyledVStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
export default PictureScanningGuide;
