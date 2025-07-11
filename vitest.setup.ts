import '@testing-library/jest-dom/vitest';

import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './mocks/node';

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
    getAmplitudeInstance: vi.fn(),
    getCurrentConsent: vi.fn(),
}));
