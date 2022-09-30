import {
    NavdsGlobalColorGreen500,
    NavdsGlobalColorNavRed,
    NavdsGlobalColorOrange500,
} from '@navikt/ds-tokens/dist/tokens';

import { bekreftelseBoksBorderFarge } from './BekreftelseOgStartSoknad';
import { BekreftelseStatus } from './useBekreftelseOgStartSoknad';

describe('Forside', () => {
    test('Return riktig borderfarge basert på status', () => {
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.FEIL)).toEqual(NavdsGlobalColorNavRed);
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.BEKREFTET)).toEqual(
            NavdsGlobalColorGreen500
        );
        expect(bekreftelseBoksBorderFarge(BekreftelseStatus.NORMAL)).toEqual(
            NavdsGlobalColorOrange500
        );
    });
});
