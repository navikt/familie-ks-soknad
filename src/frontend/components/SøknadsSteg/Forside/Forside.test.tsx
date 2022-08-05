import navFarger from 'nav-frontend-core';

import { bekreftelseBoksBorderFarge } from './BekreftelseOgStartSoknad';
import { BekreftelseStatus } from './useBekreftelseOgStartSoknad';

describe('Forside', () => {
    test('Return riktig borderfarge basert på status', () => {
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.FEIL)).toEqual(navFarger.navRod);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.BEKREFTET)).toEqual(navFarger.navGronn);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.NORMAL)).toEqual(navFarger.navOransje);
    });
});
