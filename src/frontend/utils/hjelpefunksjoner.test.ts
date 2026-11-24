import { type ISkjema, Valideringsstatus } from '@navikt/familie-skjema';
import type { IOmBarnaDineFeltTyper } from '@typer/skjema';
import { mockDeep } from 'vitest-mock-extended';

import { fjernWhiteSpace, trimWhiteSpace, visFeiloppsummering } from './hjelpefunksjoner';

describe('hjelpefunksjoner', () => {
    describe('trimWhiteSpace', () => {
        test('Skal returnere Hans Hansen dersom man sender inn "   Hans     Hansen    "', () => {
            expect(trimWhiteSpace('   Hans     Hansen    ')).toEqual('Hans Hansen');
        });
    });
    describe('fjernWhiteSpace', () => {
        test('Skal fjerne all whitespace fra fødselsnummer', () => {
            expect(fjernWhiteSpace(' 123456 12345\t')).toEqual('12345612345');
        });
    });
    describe('visFeiloppsummering', () => {
        const mockSkjemaMedFeil = mockDeep<ISkjema<IOmBarnaDineFeltTyper, string>>({
            felter: {
                hvemErFosterbarn: { erSynlig: true, valideringsstatus: Valideringsstatus.FEIL },
            },
        });

        test('Skal returnere true dersom noen felter har valideringsstatus FEIL', () => {
            expect(visFeiloppsummering(mockSkjemaMedFeil)).toEqual(true);
        });

        const mockSkjemaUtenFeil = mockDeep<ISkjema<IOmBarnaDineFeltTyper, string>>({
            felter: {
                hvemErFosterbarn: { erSynlig: true, valideringsstatus: Valideringsstatus.OK },
            },
        });

        test('Skal returnere true dersom noen felter har valideringsstatus FEIL', () => {
            expect(visFeiloppsummering(mockSkjemaUtenFeil)).toEqual(false);
        });

        const mockSkjemaMedUsynligFeltOgFeil = mockDeep<ISkjema<IOmBarnaDineFeltTyper, string>>({
            felter: {
                hvemErFosterbarn: { erSynlig: false, valideringsstatus: Valideringsstatus.FEIL },
            },
        });

        test('Skal returnere true dersom noen felter har valideringsstatus FEIL', () => {
            expect(visFeiloppsummering(mockSkjemaMedUsynligFeltOgFeil)).toEqual(false);
        });
    });
});
