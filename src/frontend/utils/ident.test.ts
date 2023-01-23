import { identTilFødselsdato } from './ident';

describe('finnFødselsdatoFraIdent', () => {
    test('Skal finne fødselsdato for HNR', () => {
        expect(identTilFødselsdato('13527248013')).toEqual('1972-12-13');
    });

    test('Skal finne fødselsdato for DNR', () => {
        expect(identTilFødselsdato('64012252500')).toEqual('2022-01-24');
    });

    test('Skal finne fødselsdato for FNR', () => {
        expect(identTilFødselsdato('24012252500')).toEqual('2022-01-24');
    });

    test('Skal finne fødselsdato for TNR', () => {
        expect(identTilFødselsdato('10915596784')).toEqual('1955-11-10');
    });
});
