import { LocaleType } from '@navikt/familie-sprakvelger';

import { ESivilstand } from '../typer/kontrakt/generelle';
import { hentSivilstatusSpråkId, hentTekster, landkodeTilSpråk } from './språk';

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

describe('hentSivilstatusSpråkId', () => {
    test('Skal returnere tekstid til sivilstatus kode UOPPGITT dersom sivilstanden er ukjent', () => {
        // eslint-disable-next-line
        // @ts-ignore fordi hele poenget er at det er en ukjent verdi
        expect(hentSivilstatusSpråkId('JEGHARKJÆRESTE')).toEqual(
            'felles.sivilstatus.kode.UOPPGITT'
        );
    });

    test('Skal returnere tekstid til innsendt sivilstatus kode', () => {
        expect(hentSivilstatusSpråkId(ESivilstand.GIFT)).toEqual(
            `felles.sivilstatus.kode.${ESivilstand.GIFT}`
        );
    });
});
