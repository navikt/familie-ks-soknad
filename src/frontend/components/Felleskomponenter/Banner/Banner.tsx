import React from 'react';

import styled from 'styled-components';

import { Innholdstittel } from 'nav-frontend-typografi';

import {
    NavdsGlobalColorPurple400,
    NavdsGlobalColorPurple200,
} from '@navikt/ds-tokens/dist/tokens';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const Section = styled.section`
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: ${NavdsGlobalColorPurple200};
    border-bottom: 4px solid ${NavdsGlobalColorPurple400};
    text-align: center;
    margin-bottom: 1rem;
`;

const Banner: React.FC<{ språkTekstId: string }> = ({ språkTekstId }) => {
    return (
        <Section>
            <Innholdstittel>
                <SpråkTekst id={språkTekstId} />
            </Innholdstittel>
        </Section>
    );
};

export default Banner;
