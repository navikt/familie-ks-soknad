import { landkodeTilSpråk } from './språk';

describe('landkodeTilSpråk', () => {
    test('Kan ta inn landkode og gjøre om til språk', () => {
        expect(landkodeTilSpråk('NOR', 'nb')).toEqual('Norge');
    });
});
