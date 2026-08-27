import { setAvailableLanguages, setParams } from '@navikt/nav-dekoratoren-moduler';
import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { LocaleType } from '../../common/typer/locale';

let languageSelectCallback: ((language: { locale: string }) => void) | undefined;
const setCookieMock = vi.fn();
const useCookiesMock = vi.fn();

vi.mock('@navikt/nav-dekoratoren-moduler', () => ({
    onLanguageSelect: vi.fn(callback => {
        languageSelectCallback = callback;
    }),
    setAvailableLanguages: vi.fn(),
    setParams: vi.fn(),
}));

vi.mock('react-cookie', () => ({
    useCookies: (...args: unknown[]) => useCookiesMock(...args),
}));

beforeEach(() => {
    vi.clearAllMocks();
    languageSelectCallback = undefined;
    useCookiesMock.mockReturnValue([{}, setCookieMock]);
});

import { SpråkProvider, useSpråkContext } from './SpråkContext';

function wrapper({ children }: PropsWithChildren) {
    return <SpråkProvider>{children}</SpråkProvider>;
}

describe('SpråkContext', () => {
    test('bruker nb som default locale når det ikke finnes en dekoratørspråk-cookie', () => {
        const { result } = renderHook(() => useSpråkContext(), { wrapper });

        expect(result.current.valgtLocale).toEqual(LocaleType.nb);
    });

    test('bruker locale fra dekoratørspråk-cookie som default locale', () => {
        useCookiesMock.mockReturnValue([{ 'decorator-language': LocaleType.en }, setCookieMock]);

        const { result } = renderHook(() => useSpråkContext(), { wrapper });

        expect(result.current.valgtLocale).toEqual(LocaleType.en);
        expect(setParams).not.toHaveBeenCalled();
    });

    test('kaller setParams med default locale når cookie ikke finnes', () => {
        renderHook(() => useSpråkContext(), { wrapper });

        expect(setParams).toHaveBeenCalledWith({ language: LocaleType.nb });
    });

    test('oppdaterer valgtLocale, dokumentspråk og cookie når språk velges i dekoratøren', () => {
        const { result } = renderHook(() => useSpråkContext(), { wrapper });

        expect(languageSelectCallback).toBeDefined();

        act(() => {
            languageSelectCallback?.({ locale: 'en' });
        });

        expect(result.current.valgtLocale).toEqual(LocaleType.en);
        expect(document.documentElement.lang).toEqual('en');
        expect(setCookieMock).toHaveBeenCalledWith('decorator-language', 'en');
    });

    test('faller tilbake til nb hvis valgt språk fra dekoratøren er ukjent', () => {
        const { result } = renderHook(() => useSpråkContext(), { wrapper });

        act(() => {
            languageSelectCallback?.({ locale: 'ukjent-språk' });
        });

        expect(result.current.valgtLocale).toEqual(LocaleType.nb);
    });

    test('visSpråkvelger setter tilgjengelige språk i dekoratøren', () => {
        const { result } = renderHook(() => useSpråkContext(), { wrapper });

        result.current.visSpråkvelger();

        expect(setAvailableLanguages).toHaveBeenCalledWith([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]);
    });

    test('skjulSpråkvelger tømmer tilgjengelige språk i dekoratøren', () => {
        const { result } = renderHook(() => useSpråkContext(), { wrapper });

        result.current.skjulSpråkvelger();

        expect(setAvailableLanguages).toHaveBeenCalledWith([]);
    });

    test('useSpråkContext kaster feil når den brukes utenfor en SpråkProvider', () => {
        expect(() => renderHook(() => useSpråkContext())).toThrow(
            'useSpråkContext må brukes innenfor en SpråkProvider.'
        );
    });
});
