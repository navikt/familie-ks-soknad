import { onLanguageSelect, setAvailableLanguages, setParams } from '@navikt/nav-dekoratoren-moduler';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { LocaleType } from '../../common/typer/locale';
import { erGyldigSpråk } from '../typer/common';

const dekoratorLanguageCookieName = 'decorator-language';

interface SpråkContext {
    valgtLocale: LocaleType;
    visSpråkvelger: () => void;
    skjulSpråkvelger: () => void;
}

const SpråkContext = createContext<SpråkContext | undefined>(undefined);

export function SpråkProvider(props: PropsWithChildren) {
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName]);
    const { [dekoratorLanguageCookieName]: dekoratørSpråk } = cookies;
    const defaultSpråk = erGyldigSpråk(dekoratørSpråk) ? dekoratørSpråk : LocaleType.nb;

    const [locale, settLocale] = useState<LocaleType>(defaultSpråk);

    const visSpråkvelger = useCallback(() => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]);
    }, []);

    const skjulSpråkvelger = useCallback(() => {
        setAvailableLanguages([]);
    }, []);

    useEffect(() => {
        if (dekoratørSpråk !== defaultSpråk) {
            setParams({ language: defaultSpråk });
        }
    }, []);

    useEffect(() => {
        onLanguageSelect(language => {
            settLocale(erGyldigSpråk(language.locale) ? language.locale : LocaleType.nb);
            document.documentElement.lang = language.locale;
            setCookie(dekoratorLanguageCookieName, language.locale);
        });
    }, []);

    const value = useMemo(
        () => ({ valgtLocale: locale, visSpråkvelger, skjulSpråkvelger }),
        [locale, visSpråkvelger, skjulSpråkvelger]
    );

    return <SpråkContext.Provider value={value}>{props.children}</SpråkContext.Provider>;
}

export function useSpråkContext() {
    const context = useContext(SpråkContext);
    if (context === undefined) {
        throw new Error('useSpråkContext må brukes innenfor en SpråkProvider.');
    }
    return context;
}
