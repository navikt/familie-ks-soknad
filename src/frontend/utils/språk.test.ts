import { LocaleType } from '@navikt/familie-sprakvelger';

import { hentTekster, landkodeTilSpråk } from './språk';

describe('hentTekster', () => {
    test('kan hente språktekster med hentTekster med ulike språk', () => {
        const tekster = hentTekster('dinlivssituasjon.sidetittel');
        expect(tekster[LocaleType.nb]).toEqual('Livssituasjonen din');
        expect(tekster[LocaleType.en]).toEqual('Your life situation');
    });

    test('kan hente tekster med formattering', () => {
        const navn = hentTekster('hvilkebarn.barn.navn', { navn: 'Janne' });
        expect(navn[LocaleType.nb]).toEqual('Janne');

        const punktliste = hentTekster('forside.info.punktliste');
        expect(punktliste[LocaleType.nb]).toMatch('<ul>');
    });
});

describe('landkodeTilSpråk', () => {
    test('Kan ta inn landkode og gjøre om til språk', () => {
        expect(landkodeTilSpråk('NOR', 'nb')).toEqual('Norge');
    });
});
