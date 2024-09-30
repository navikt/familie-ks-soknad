import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Alert, BodyShort, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { useSpråk } from '../../../context/SpråkContext';
import { Typografi } from '../../../typer/common';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { landkodeTilSpråk, sivilstandTilSanitySivilstandApiKey } from '../../../utils/språk';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

export const Personopplysninger: React.FC = () => {
    const { valgtLocale } = useSpråk();
    const { søknad, tekster, plainTekst } = useApp();
    const { toggles } = useFeatureToggles();

    const søker = søknad.søker;

    const {
        [ESanitySteg.OM_DEG]: {
            personopplysningerAlert,
            ident,
            statsborgerskap,
            sivilstatus,
            adresse,
        },
        [ESanitySteg.FELLES]: { frittståendeOrd },
    } = tekster();

    return (
        <>
            {!toggles.VIS_GUIDE_I_STEG && (
                <Alert variant={'info'} inline>
                    <TekstBlock block={personopplysningerAlert} typografi={Typografi.BodyShort} />
                </Alert>
            )}

            <div>
                <Label>{plainTekst(ident)}</Label>
                <BodyShort>{søker.ident}</BodyShort>
            </div>

            <div>
                <Label>{plainTekst(statsborgerskap)}</Label>
                <BodyShort>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </BodyShort>
            </div>

            <div>
                <Label>{plainTekst(sivilstatus)}</Label>
                <BodyShort>
                    {plainTekst(
                        frittståendeOrd[sivilstandTilSanitySivilstandApiKey(søker.sivilstand.type)]
                    )}
                </BodyShort>
            </div>

            <div>
                <Label>{plainTekst(adresse)}</Label>
                {genererAdresseVisning(søker, tekster().OM_DEG, plainTekst)}
            </div>
        </>
    );
};
