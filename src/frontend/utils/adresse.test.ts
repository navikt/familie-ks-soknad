import { IAdresse } from '../typer/kontrakt/generelle';
import { hentAdressefelterSortert, erNorskPostnummer } from './adresse';

describe('postnummer', () => {
    test('Skal returnere true for gyldige postnummer', () => {
        expect(erNorskPostnummer('1234')).toEqual(true);
    });

    test('Skal returnere false for ugyldige postnummer', () => {
        expect(erNorskPostnummer('12')).toEqual(false);
        expect(erNorskPostnummer('AB12345678919')).toEqual(false);
        expect(erNorskPostnummer('XXX/()>')).toEqual(false);
    });
});

describe('Adresse', () => {
    test('Kan rendre standard adresse', () => {
        const adresse: IAdresse = {
            adressenavn: 'Testgata',
            husbokstav: 'C',
            husnummer: '1',
            postnummer: '1263',
        };

        const result = hentAdressefelterSortert(adresse);
        expect(result).toEqual(['Testgata 1C', '1263']);
    });

    test('Kan rendre rar adresse', () => {
        const adresse: IAdresse = {
            adressenavn: 'Bestemorenga',
            postnummer: '8020',
            poststed: 'Bodø',
        };

        const result = hentAdressefelterSortert(adresse);
        expect(result).toEqual(['Bestemorenga', '8020 Bodø']);
    });
});
