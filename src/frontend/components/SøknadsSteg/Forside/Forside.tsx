import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sidetittel } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../../assets/VeilederSnakkeboble';
import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import Miljø from '../../../Miljø';
import { RouteEnum } from '../../../typer/routes';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { logSidevisningKontantstøtte } from '../../../utils/amplitude';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
    const { formatMessage } = useIntl();

    const { sluttbruker, mellomlagretVerdi, settNåværendeRoute } = useApp();
    const { tekster } = useApp();

    const {
        [ESanitySteg.FORSIDE]: { punktliste },
    } = tekster();

    useFørsteRender(() => logSidevisningKontantstøtte(`${RouteEnum.Forside}`));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
    }, []);

    const kanFortsettePåSøknad =
        mellomlagretVerdi && mellomlagretVerdi.modellVersjon === Miljø().modellVersjon;

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    return (
        <InnholdContainer>
            <VeilederSnakkeboble
                tekst={formatMessage(
                    { id: 'forside.veilederhilsen' },
                    { navn: navn.toUpperCase() }
                )}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <SpråkTekst id={'forside.sidetittel'} />
            </StyledSidetittel>

            <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />

            <Informasjonsbolk>
                <TekstBlock block={punktliste.innhold} />
            </Informasjonsbolk>

            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}

            <Informasjonsbolk>
                <EksternLenke
                    lenkeSpråkId={'forside.behandling-av-personopplysning.lenke'}
                    lenkeTekstSpråkId={'forside.behandling-av-personopplysning.lenketekst'}
                    target="_blank"
                />
            </Informasjonsbolk>
        </InnholdContainer>
    );
};

export default Forside;
