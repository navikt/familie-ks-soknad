import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Sidetittel } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';

import VeilederSnakkeboble from '../../../assets/VeilederSnakkeboble';
import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import Miljø from '../../../Miljø';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg } from '../../../typer/sanity';
import { logSidevisningKontantstøtte } from '../../../utils/amplitude';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

const StyledSidetittel = styled(Sidetittel)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto;
`;

const Forside: React.FC = () => {
    const { mellomlagretVerdi, settNåværendeRoute } = useApp();
    const { tekster } = useApp();

    const {
        [ESanitySteg.FORSIDE]: {
            punktliste,
            veilederhilsen,
            soknadstittel,
            personopplysningslenke,
        },
    } = tekster();

    useFørsteRender(() => logSidevisningKontantstøtte(`${RouteEnum.Forside}`));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
    }, []);

    const kanFortsettePåSøknad =
        mellomlagretVerdi && mellomlagretVerdi.modellVersjon === Miljø().modellVersjon;

    return (
        <InnholdContainer>
            <VeilederSnakkeboble
                tekst={<TekstBlock block={veilederhilsen.veilederhilsen} />}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <TekstBlock block={soknadstittel.soknadstittel} />
            </StyledSidetittel>

            <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />

            <Informasjonsbolk>
                <TekstBlock block={punktliste.innhold} />
            </Informasjonsbolk>

            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}

            <Informasjonsbolk>
                <TekstBlock block={personopplysningslenke.personopplysningslenke} />
            </Informasjonsbolk>
        </InnholdContainer>
    );
};

export default Forside;
