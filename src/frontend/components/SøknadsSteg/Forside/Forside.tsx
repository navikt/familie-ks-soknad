import React, { useEffect } from 'react';

import styled from 'styled-components';

import { GuidePanel } from '@navikt/ds-react';
import { setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';

import Miljø from '../../../../shared-utils/Miljø';
import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { Typografi } from '../../../typer/common';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { logSidevisningKontantstøtte } from '../../../utils/amplitude';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

const TittelContainer = styled.div`
    && {
        margin-top: 4rem;
    }
`;

const Forside: React.FC = () => {
    const { mellomlagretVerdi, settNåværendeRoute, tekster } = useApp();

    const {
        [ESanitySteg.FORSIDE]: {
            punktliste,
            veilederhilsen,
            soeknadstittel,
            personopplysningslenke,
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
        <InnholdContainer>
            <GuidePanel>
                <TekstBlock block={veilederhilsen} typografi={Typografi.BodyShort} />
            </GuidePanel>

            <TittelContainer>
                <TekstBlock block={soeknadstittel} typografi={Typografi.ForsideHeadingH1} />
            </TittelContainer>

            <Informasjonsbolk>
                <TekstBlock block={punktliste} />
            </Informasjonsbolk>

            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}

            <Informasjonsbolk>
                <TekstBlock block={personopplysningslenke} />
            </Informasjonsbolk>
        </InnholdContainer>
    );
};

export default Forside;
