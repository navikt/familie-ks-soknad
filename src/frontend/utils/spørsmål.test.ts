import { ESvar } from '@navikt/familie-form-elements';

import { jaNeiSvarTilSpråkId } from './spørsmål';

describe('spørsmål utils', () => {
    it('test jaNeiSvarTilSpråkId', () => {
        const svarJa = 'felles.svaralternativ.ja';
        const svarNei = 'felles.svaralternativ.nei';
        const svarVetIkke = 'felles.svaralternativ.vetikke';
        expect(jaNeiSvarTilSpråkId(ESvar.JA)).toBe(svarJa);
        expect(jaNeiSvarTilSpråkId(ESvar.NEI)).toBe(svarNei);
        expect(jaNeiSvarTilSpråkId(ESvar.VET_IKKE)).toBe(svarVetIkke);
    });
});
