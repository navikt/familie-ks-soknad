import React from 'react';

import styled from 'styled-components';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useApp } from '../../context/AppContext';
import { Typografi } from '../../typer/common';
import { DekoratørenSpråkHandler } from '../Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../Felleskomponenter/TekstBlock';

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto auto 2rem auto;
`;

const TittelContainer = styled.div`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

export const DisabledApp: React.FC = () => {
    const { tekster } = useApp();
    const { vedlikeholdTittel, vedlikeholdBroedtekst, vedlikeholdVeileder } =
        tekster().FELLES.vedlikeholdsarbeid;
    return (
        <main>
            <DekoratørenSpråkHandler />
            <InnholdContainer>
                {
                    // TODO: Dekoratøren språk-handling fra PR: #265
                }
                <VeilederSnakkeboble
                    tekst={<TekstBlock block={vedlikeholdVeileder} />}
                    posisjon={'høyre'}
                />
                <TittelContainer>
                    <TekstBlock block={vedlikeholdTittel} typografi={Typografi.ForsideHeadingH1} />
                </TittelContainer>
                <StyledSpråkvelger støttedeSprak={[LocaleType.nb, LocaleType.nn, LocaleType.en]} />
                <TekstBlock block={vedlikeholdBroedtekst} />
            </InnholdContainer>
        </main>
    );
};
