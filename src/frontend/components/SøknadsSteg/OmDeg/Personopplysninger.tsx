import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { sivilstandTilSanitySivilstandApiKey, landkodeTilSpråk } from '../../../utils/språk';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

export const Personopplysninger: React.FC = () => {
    const [valgtLocale] = useSprakContext();

    const { søknad, tekster, localeString } = useApp();
    const søker = søknad.søker;

    const {
        [ESanitySteg.OM_DEG]: {
            personopplysningerAlert,
            idnummer,
            statsborgerskap,
            sivilstatus,
            adresse,
        },
        [ESanitySteg.FELLES]: { frittståendeOrd },
    } = tekster();

    return (
        <>
            <AlertStripe variant={'info'}>
                <TekstBlock block={personopplysningerAlert} />
            </AlertStripe>

            <Informasjonsbolk>
                <Element>{localeString(idnummer)}</Element>
                <Normaltekst>{søker.ident}</Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>{localeString(statsborgerskap)}</Element>
                <Normaltekst>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>{localeString(sivilstatus)}</Element>
                <Normaltekst>
                    {localeString(
                        frittståendeOrd[sivilstandTilSanitySivilstandApiKey(søker.sivilstand.type)]
                    )}
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>{localeString(adresse)}</Element>
                {genererAdresseVisning(søker)}
            </Informasjonsbolk>
        </>
    );
};
