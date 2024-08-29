import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { useCookies } from 'react-cookie';

import { onLanguageSelect, setParams } from '@navikt/nav-dekoratoren-moduler';

import { erGyldigSpråk, LocaleType } from '../typer/common';

const dekoratorLanguageCookieName = 'decorator-language';

export const [SpråkProvider, useSpråk] = createUseContext(() => {
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;

    const defaultSpråk = erGyldigSpråk(dekoratørSpråk) ? dekoratørSpråk : LocaleType.nb;

    const [valgtLocale, settValgtLocale] = useState<LocaleType>(defaultSpråk);

    useEffect(() => {
        // Bryr oss egenlig ikke om hva som skjer etterpå men intellij klager på ignorert promise
        setParams({ language: defaultSpråk }).then();
    }, []);

    onLanguageSelect(language => {
        settValgtLocale(language.locale as LocaleType);
        document.documentElement.lang = language.locale;
        setCookie(dekoratorLanguageCookieName, language.locale);
    });

    return { valgtLocale };
});
