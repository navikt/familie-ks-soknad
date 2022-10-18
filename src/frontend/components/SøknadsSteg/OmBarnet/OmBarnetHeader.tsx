import React from 'react';

import styled from 'styled-components';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { TilfeldigBarnIkon } from '../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

const HeaderWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BarnCounterWrapper = styled.div`
    padding: 1rem;
`;

const HorisontalLinje = styled.span`
    width: 100%;
    border-bottom: 1px solid black;
`;

export const OmBarnetHeader: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        søknad: { barnInkludertISøknaden },
        tekster,
    } = useApp();
    const barnIndex = barnInkludertISøknaden.findIndex(b => b.id === barn.id);

    return (
        <HeaderWrapper>
            <TilfeldigBarnIkon byttVedRerender={false} />
            <HorisontalLinje />
            <BarnCounterWrapper>
                <TekstBlock
                    block={tekster()[ESanitySteg.OM_BARNET].barnXAvY}
                    flettefelter={{
                        antall: (barnIndex + 1).toString(),
                        totalAntall: barnInkludertISøknaden.length.toString(),
                    }}
                    typografi={Typografi.HeadingH2}
                />
            </BarnCounterWrapper>
        </HeaderWrapper>
    );
};
