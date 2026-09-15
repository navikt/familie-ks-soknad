import { describe, expect, test } from 'vitest';

import { InnloggetStatus, utledInnloggetStatus } from './autentisering';

describe('utledInnloggetStatus', () => {
    test('returnerer AUTENTISERT når kallet er vellykket', () => {
        expect(utledInnloggetStatus(true, false, false)).toBe(InnloggetStatus.AUTENTISERT);
    });

    test('returnerer IKKE_VERIFISERT når kallet fortsatt er pending, selv om isSuccess eller isError også er satt', () => {
        expect(utledInnloggetStatus(true, true, true)).toBe(InnloggetStatus.IKKE_VERIFISERT);
    });

    test('returnerer IKKE_VERIFISERT når kallet fortsatt er pending', () => {
        expect(utledInnloggetStatus(false, true, false)).toBe(InnloggetStatus.IKKE_VERIFISERT);
    });

    test('returnerer FEILET når kallet har feilet og ikke er pending', () => {
        expect(utledInnloggetStatus(false, false, true)).toBe(InnloggetStatus.FEILET);
    });

    test('returnerer FEILET når kallet har feilet selv om isSuccess også er satt', () => {
        expect(utledInnloggetStatus(true, false, true)).toBe(InnloggetStatus.FEILET);
    });

    test('returnerer IKKE_VERIFISERT som fallback når verken success, pending eller error er satt', () => {
        expect(utledInnloggetStatus(false, false, false)).toBe(InnloggetStatus.IKKE_VERIFISERT);
    });
});
