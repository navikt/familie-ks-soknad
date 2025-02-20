import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { useCookies } from 'react-cookie';

import { onLanguageSelect, setParams } from '@navikt/nav-dekoratoren-moduler';

import { erGyldigSpråk, LocaleType } from '../typer/common';

const dekoratorLanguageCookieName = 'decorator-language';

interface SpråkContext {
    valgtLocale: LocaleType;
}

const SpråkContext = createContext<SpråkContext | undefined>(undefined);

export function SpråkProvider(props: PropsWithChildren) {
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;
    const defaultSpråk = erGyldigSpråk(dekoratørSpråk) ? dekoratørSpråk : LocaleType.nb;
    const [valgtLocale, settValgtLocale] = useState<LocaleType>(defaultSpråk);

    useEffect(() => {
        if (dekoratørSpråk !== defaultSpråk) {
            setParams({ language: defaultSpråk });
        }
    }, []);

    onLanguageSelect(language => {
        settValgtLocale(language.locale as LocaleType);
        document.documentElement.lang = language.locale;
        setCookie(dekoratorLanguageCookieName, language.locale);
    });

    return <SpråkContext.Provider value={{ valgtLocale }}>{props.children}</SpråkContext.Provider>;
}

export function useSpråk() {
    const context = useContext(SpråkContext);

    if (context === undefined) {
        throw new Error('useSpråk må brukes innenfor SpråkProvider');
    }

    return context;
}
