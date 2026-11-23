import miljø from '@common/miljø';
import InnholdContainer from '@components/Felleskomponenter/InnholdContainer/InnholdContainer';
import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import { useAppContext } from '@context/AppContext';
import { useSanityTekster } from '@context/SanityContext';
import { useSpråkContext } from '@context/SpråkContext';
import { useTranslate } from '@hooks/useTranslate';
import { Accordion, GuidePanel, Heading } from '@navikt/ds-react';
import { Typografi } from '@typer/common';
import { RouteEnum } from '@typer/routes';
import { ESanitySteg } from '@typer/sanity/sanity';
import { type FC, useEffect } from 'react';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import styles from './Forside.module.css';
import { FortsettPåSøknad } from './FortsettPåSøknad';

const Forside: FC = () => {
    const { mellomlagretVerdi, settNåværendeRoute } = useAppContext();
    const { visSpråkvelger } = useSpråkContext();

    const forsidetekster = useSanityTekster(ESanitySteg.FORSIDE);
    const translate = useTranslate();

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
        visSpråkvelger();
    }, []);

    const kanFortsettePåSøknad = mellomlagretVerdi && mellomlagretVerdi.modellVersjon === miljø().modellVersjon;

    return (
        <InnholdContainer>
            <GuidePanel poster>
                <Heading level="2" size="medium" spacing>
                    {translate(forsidetekster.veilederHei)}
                </Heading>
                <TekstBlock block={forsidetekster.veilederIntro} typografi={Typografi.BodyLong} />
            </GuidePanel>
            <div className={styles.textBlockContainer}>
                <Heading level="2" size="large" spacing>
                    {translate(forsidetekster.foerDuSoekerTittel)}
                </Heading>
                <TekstBlock block={forsidetekster.foerDuSoeker} typografi={Typografi.BodyLong} />
            </div>
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>{translate(forsidetekster.informasjonOmPlikterTittel)}</Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmPlikter} typografi={Typografi.BodyLong} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        {translate(forsidetekster.informasjonOmPersonopplysningerTittel)}
                    </Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock
                            block={forsidetekster.informasjonOmPersonopplysninger}
                            typografi={Typografi.BodyLong}
                        />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>{translate(forsidetekster.informasjonOmLagringAvSvarTittel)}</Accordion.Header>
                    <Accordion.Content>
                        <TekstBlock block={forsidetekster.informasjonOmLagringAvSvar} typografi={Typografi.BodyLong} />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>

            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}
        </InnholdContainer>
    );
};

export default Forside;
