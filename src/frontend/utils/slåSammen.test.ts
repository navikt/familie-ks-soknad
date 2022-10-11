import { slåSammen } from './slåSammen';

describe('slåSammen', () => {
    test('Returnerer tom streng ved tom liste ', () => {
        expect(slåSammen([])).toEqual('');
    });

    test('Returnerer første element om det kun er ett element i listen', () => {
        expect(slåSammen(['test'])).toEqual('test');
    });

    test('Returnerer kommaseparert streng med og på slutten ved flere elementer', () => {
        const sammenslåttTekst1 = slåSammen(['test1', 'test2', 'test3']);
        expect(sammenslåttTekst1).toEqual('test1, test2 og test3');

        const sammenslåttTekst2 = slåSammen(['test1', 'test2', 'test3', 'test4', 'test5', 'test6']);
        expect(sammenslåttTekst2).toEqual('test1, test2, test3, test4, test5 og test6');
    });
});
