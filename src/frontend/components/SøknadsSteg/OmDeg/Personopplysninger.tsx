import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { landkodeTilSpråk, sivilstandTilSanitySivilstandApiKey } from '../../../utils/språk';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';

export const Personopplysninger: React.FC = () => {
    const { valgtLocale } = useSpråk();
    const { søknad, tekster, plainTekst } = useApp();

    const søker = søknad.søker;

    const {
        [ESanitySteg.OM_DEG]: { ident, statsborgerskap, sivilstatus, adresse },
        [ESanitySteg.FELLES]: { frittståendeOrd },
    } = tekster();

    return (
        <>
            <Informasjonsbolk>
                <Label>{plainTekst(ident)}</Label>
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
                {genererAdresseVisning(søker, tekster().OM_DEG, plainTekst)}
            </Informasjonsbolk>
        </>
    );
};
