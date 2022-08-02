import React, { useEffect } from 'react';

import { useCookies } from 'react-cookie';

import { useSprakContext } from '@navikt/familie-sprakvelger';
import { setParams } from '@navikt/nav-dekoratoren-moduler';

const dekoratorLanguageCookieName = 'decorator-language';

export const DekoratørenSpråkHandler: React.FC = () => {
    const [valgtLocale, settValgtLocale] = useSprakContext();
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;

    !dekoratørSpråk && setCookie(dekoratorLanguageCookieName, valgtLocale);

    useEffect(() => {
        // Bryr oss egenlig ikke om hva som skjer etterpå men intellij klager på ignorert promise
        setParams({ language: valgtLocale }).then();
        setCookie(dekoratorLanguageCookieName, valgtLocale);
        document.documentElement.lang = valgtLocale;
    }, [valgtLocale]);

    useEffect(() => {
        dekoratørSpråk && settValgtLocale(dekoratørSpråk);
    }, []);

    return null;
};
