import React, { useEffect } from 'react';

import styled from 'styled-components';

import { GuidePanel } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import { useLastRessurserContext } from '../../context/LastRessurserContext';
import { useSanity } from '../../context/SanityContext';
import { Typografi } from '../../typer/common';
import { Feilside } from '../Felleskomponenter/Feilside/Feilside';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SystemetLaster from '../Felleskomponenter/SystemetLaster/SystemetLaster';
import TekstBlock from '../Felleskomponenter/TekstBlock';

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

    useEffect(() => {
        visSpråkvelger();
    }, []);

    const visSpråkvelger = () => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]).then();
    };

    const { vedlikeholdTittel, vedlikeholdBroedtekst, vedlikeholdVeileder } =
        teksterRessurs.data.FELLES.vedlikeholdsarbeid;

    return (
        <main>
            <InnholdContainer>
                <GuidePanel>
                    <TekstBlock block={vedlikeholdVeileder} />
                </GuidePanel>
                <TittelContainer>
                    <TekstBlock block={vedlikeholdTittel} typografi={Typografi.ForsideHeadingH1} />
                </TittelContainer>
                <TekstBlock block={vedlikeholdBroedtekst} />
            </InnholdContainer>
        </main>
    );
};
