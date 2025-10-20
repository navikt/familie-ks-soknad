import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { landkodeTilSpråk, sivilstandTilSanitySivilstandApiKey } from '../../../utils/språk';

export const Personopplysninger: React.FC = () => {
    const { valgtLocale } = useSpråkContext();
    const { søknad, tekster, plainTekst } = useAppContext();

    const søker = søknad.søker;

    const {
        [ESanitySteg.OM_DEG]: { ident, statsborgerskap, sivilstatus, adresse },
        [ESanitySteg.FELLES]: { frittståendeOrd },
    } = tekster();

    return (
        <>
            <div>
                <BodyShort weight="semibold">{plainTekst(ident)}</BodyShort>
                <BodyShort>{søker.ident}</BodyShort>
            </div>

            <div>
                <BodyShort weight="semibold">{plainTekst(statsborgerskap)}</BodyShort>
                <BodyShort>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </BodyShort>
            </div>

            <div>
                <BodyShort weight="semibold">{plainTekst(sivilstatus)}</BodyShort>
                <BodyShort>
                    {plainTekst(frittståendeOrd[sivilstandTilSanitySivilstandApiKey(søker.sivilstand.type)])}
                </BodyShort>
            </div>

            <div>
                <BodyShort weight="semibold">{plainTekst(adresse)}</BodyShort>
                {genererAdresseVisning(søker, tekster().OM_DEG, plainTekst)}
            </div>
        </>
    );
};
