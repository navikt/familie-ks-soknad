import React from 'react';

import styled from 'styled-components';

import { GuidePanel } from '@navikt/ds-react';
import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import { useLastRessurserContext } from '../../context/LastRessurserContext';
import { useSanity } from '../../context/SanityContext';
import { Typografi } from '../../typer/common';
import { DekoratørenSpråkHandler } from '../Felleskomponenter/Dekoratøren/DekoratørenSpråkHandler';
import { Feilside } from '../Felleskomponenter/Feilside/Feilside';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
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
    const { teksterRessurs } = useSanity();
    const { lasterRessurser } = useLastRessurserContext();

    if (lasterRessurser()) {
        return <SystemetLaster />;
    }

    if (teksterRessurs.status !== RessursStatus.SUKSESS) {
        return <Feilside />;
    }

    const { vedlikeholdTittel, vedlikeholdBroedtekst, vedlikeholdVeileder } =
        teksterRessurs.data.FELLES.vedlikeholdsarbeid;

    return (
        <main>
            <DekoratørenSpråkHandler />
            <InnholdContainer>
                {
                    // TODO: Dekoratøren språk-handling fra PR: #265
                }
                <GuidePanel>
                    <TekstBlock block={vedlikeholdVeileder} />
                </GuidePanel>
                <TittelContainer>
                    <TekstBlock block={vedlikeholdTittel} typografi={Typografi.ForsideHeadingH1} />
                </TittelContainer>
                <StyledSpråkvelger støttedeSprak={[LocaleType.nb, LocaleType.nn, LocaleType.en]} />
                <TekstBlock block={vedlikeholdBroedtekst} />
            </InnholdContainer>
        </main>
    );
};
