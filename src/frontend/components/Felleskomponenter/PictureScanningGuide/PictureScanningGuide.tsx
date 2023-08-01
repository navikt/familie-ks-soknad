import React from 'react';

import styled from 'styled-components';

import PictureScanningExample from './PictureScanningExample';
import ScanningIcon from './ScanningIcon';
import { useApp } from '../../../context/AppContext';
import ExpandableInfo from '../expandableContent/ExpandableInfo';
import TekstBlock from '../TekstBlock';

const Container = styled.div`
    svg {
        pointer-events: none;
    }

    ul {
        margin: 0 0 1rem 0;
        li {
            margin-bottom: 0.5rem;
        }
    }
`;

const EksempelBilderWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
`;

const BildeContainer = styled.div`
    flex: 1 1 50%;
    height: auto;
    padding: 0.5rem 0.5rem 1.5rem 0.5rem;
    &:first-child {
        padding-left: 0;
    }
    &:last-child {
        padding-right: 0;
    }
    @media screen and (min-width: 768px) {
        max-width: 25%;
    }
`;

const PictureScanningGuide = () => {
    const { tekster, plainTekst } = useApp();
    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const svgIconHeight = 100;
    return (
        <ExpandableInfo title={plainTekst(dokumentasjonTekster.slikTarDuEtGodtBildeExpand)}>
            <Container>
                <TekstBlock block={dokumentasjonTekster.slikTarDuEtGodtBilde} />
                <TekstBlock block={dokumentasjonTekster.etterDuHarTattBildet} />

                <div>
                    <TekstBlock block={dokumentasjonTekster.braOgDaarligeTittel} />
                    <EksempelBilderWrapper>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="good" height={svgIconHeight} />}
                                status="suksess"
                                statusText={plainTekst(dokumentasjonTekster.bra)}
                                description={plainTekst(dokumentasjonTekster.fyllerHeleBildet)}
                            />
                        </BildeContainer>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                                status="feil"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.ikkeTattOvenfra)}
                            />
                        </BildeContainer>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                                status="feil"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.ikkeRiktigRetning)}
                            />
                        </BildeContainer>
                        <BildeContainer>
                            <PictureScanningExample
                                image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                                status="feil"
                                statusText={plainTekst(dokumentasjonTekster.daarlig)}
                                description={plainTekst(dokumentasjonTekster.skyggePaaDokumentet)}
                            />
                        </BildeContainer>
                    </EksempelBilderWrapper>
                    <TekstBlock block={dokumentasjonTekster.merHjelpLenke} />
                </div>
            </Container>
        </ExpandableInfo>
    );
};
export default PictureScanningGuide;
