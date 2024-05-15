import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { useCookies } from 'react-cookie';

import { onLanguageSelect, setParams } from '@navikt/nav-dekoratoren-moduler';

import { LocaleType } from '../typer/common';

const dekoratorLanguageCookieName = 'decorator-language';

export const [SpråkProvider, useSpråk] = createUseContext(() => {
    const [cookies] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;

    const defaultSpråk = (dekoratørSpråk as LocaleType) ?? LocaleType.nb;

    const [valgtLocale, settValgtLocale] = useState<LocaleType>(defaultSpråk);

    useEffect(() => {
        // Bryr oss egenlig ikke om hva som skjer etterpå men intellij klager på ignorert promise
        setParams({ language: defaultSpråk }).then();
    }, []);

    onLanguageSelect(language => {
        settValgtLocale(language.locale as LocaleType);
        document.documentElement.lang = language.locale;
    });

    return { valgtLocale };
});
