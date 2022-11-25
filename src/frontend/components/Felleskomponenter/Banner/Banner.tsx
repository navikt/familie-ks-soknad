import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';
import {
    NavdsGlobalColorPurple200,
    NavdsGlobalColorPurple400,
} from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';

const Section = styled.section`
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: ${NavdsGlobalColorPurple200};
    border-bottom: 4px solid ${NavdsGlobalColorPurple400};
    text-align: center;
    margin-bottom: 1rem;
`;

const Banner: React.FC = () => {
    const { tekster, plainTekst } = useApp();
    return (
        <Section>
            <Heading size={'large'} level={'1'}>
                {plainTekst(tekster().FELLES.banner)}
            </Heading>
        </Section>
    );
};

export default Banner;
