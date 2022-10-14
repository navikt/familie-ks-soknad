import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort, Label } from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { landkodeTilSpråk, sivilstandTilSanitySivilstandApiKey } from '../../../utils/språk';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

export const Personopplysninger: React.FC = () => {
    const [valgtLocale] = useSprakContext();

    const { søknad, tekster, plainTekst } = useApp();
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
                <TekstBlock block={personopplysningerAlert} typografi={Typografi.BodyShort} />
            </AlertStripe>

            <Informasjonsbolk>
                <Label>{plainTekst(idnummer)}</Label>
                <BodyShort>{søker.ident}</BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label>{plainTekst(statsborgerskap)}</Label>
                <BodyShort>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label>{plainTekst(sivilstatus)}</Label>
                <BodyShort>
                    {plainTekst(
                        frittståendeOrd[sivilstandTilSanitySivilstandApiKey(søker.sivilstand.type)]
                    )}
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label>{plainTekst(adresse)}</Label>
                {genererAdresseVisning(søker)}
            </Informasjonsbolk>
        </>
    );
};
