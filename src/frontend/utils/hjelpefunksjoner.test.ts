import { mockDeep } from 'jest-mock-extended';

import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { IOmBarnaDineFeltTyper } from '../typer/skjema';
import { trimWhiteSpace, visFeiloppsummering } from './hjelpefunksjoner';

describe('hjelpefunksjoner', () => {
    describe('trimWhiteSpace', () => {
        test('Skal returnere Hans Hansen dersom man sender inn "   Hans     Hansen    "', () => {
            expect(trimWhiteSpace('   Hans     Hansen    ')).toEqual('Hans Hansen');
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
