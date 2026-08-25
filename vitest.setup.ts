import '@testing-library/jest-dom/vitest';

import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { server } from './mocks/node';
import type { ITekstinnhold } from './src/frontend/typer/sanity/tekstInnhold';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

window.scrollTo = () => {
    // Ikke implementert
};

vi.mock('@navikt/nav-dekoratoren-moduler', () => ({
    setAvailableLanguages: vi.fn().mockImplementation(() => {
        return Promise.resolve();
    }),
    onLanguageSelect: vi.fn(),
    getCurrentConsent: vi.fn(),
}));

// useHentSanityTekster henter tekster over nett via @sanity/client. I tester mocker vi selve
// hooken slik at den returnerer ferdig transformerte testtekster direkte, uten nettverkskall.
vi.mock('./src/frontend/hooks/useHentSanityTekster', () => ({
    useHentSanityTekster: () => ({
        data: mockDeep<ITekstinnhold>(),
        isPending: false,
        error: null,
    }),
}));
