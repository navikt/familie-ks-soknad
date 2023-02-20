import { add } from 'date-fns';

import { erDatoFormatGodkjent, erDatoFremITid } from './dato';

describe('erDatoFormatGodkjent', () => {
    test('Skal returnere false dersom dato ikke er gyldig', () => {
        expect(erDatoFormatGodkjent(new Date('2008-14-02'))).toEqual(false);
    });

    test('Skal returnere false dersom dato er på feil format', () => {
        expect(erDatoFormatGodkjent(new Date('102-14-2008'))).toEqual(false);
    });

    test('Skal returnere false dersom dato er en tekst', () => {
        expect(erDatoFormatGodkjent(new Date('jegerendato'))).toEqual(false);
    });

    test('Skal returnere true dersom dato er på riktig format og gyldig', () => {
        expect(erDatoFormatGodkjent(new Date('2008-12-02'))).toEqual(true);
    });
});

describe('erDatoFremITid', () => {
    test('Skal returnere false dersom dato ikke er frem i tid', () => {
        expect(erDatoFremITid(new Date('2020-14-04'))).toEqual(false);
    });

    test('Skal returnere false dersom dato er idag', () => {
        expect(erDatoFremITid(new Date())).toEqual(false);
    });

    test('Skal returnere true dersom dato er frem i tid', () => {
        expect(erDatoFremITid(add(new Date(), { days: 7 }))).toEqual(true);
    });
});
