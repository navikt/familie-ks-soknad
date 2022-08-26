import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { hentSivilstatusSpråkId, landkodeTilSpråk } from '../../../utils/språk';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import { omDegPersonopplysningerSpråkId } from './spørsmål';

export const Personopplysninger: React.FC = () => {
    const [valgtLocale] = useSprakContext();

    const { søknad, tekster, localeString } = useApp();
    const søker = søknad.søker;

    const {
        [ESanitySteg.OM_DEG]: { personopplysninger },
    } = tekster();

    return (
        <>
            <AlertStripe variant={'info'}>
                <TekstBlock block={personopplysninger.alert.alertTekst} />
            </AlertStripe>

            <Informasjonsbolk>
                <Element>{localeString(personopplysninger.ident)}</Element>
                <Normaltekst>{søker.ident}</Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerStatsborgerskap} />
                </Element>
                <Normaltekst>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />
                </Element>
                <Normaltekst>
                    <SpråkTekst id={hentSivilstatusSpråkId(søker.sivilstand.type)} />
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />
                </Element>
                {genererAdresseVisning(søker)}
            </Informasjonsbolk>
        </>
    );
};
