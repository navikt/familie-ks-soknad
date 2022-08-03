import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { DeepPartial } from 'ts-essentials';

import { ESvar } from '@navikt/familie-form-elements';

import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../typer/barn';
import { IBarn } from '../../../typer/person';
import { genererInitialBarnMedISøknad, genererInitiellAndreForelder } from '../../../utils/barn';
import { mockEøs, silenceConsoleErrors, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';

describe('useOmBarnet', () => {
    beforeEach(() => mockEøs());
    const barnFraPdl: IBarn = {
        id: 'random-id-1',
        navn: 'Barn Barnessen',
        ident: '1234',
        borMedSøker: true,
        alder: null,
        adressebeskyttelse: false,
    };

    beforeEach(() => {
        silenceConsoleErrors();
        jest.useFakeTimers('modern');
    });

    it('Setter institusjonsfelter til tomme strenger hvis barnet ikke bor på institusjon', async () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: {
                        institusjonsnavn,
                        institusjonsadresse,
                        institusjonspostnummer,
                        institusjonOppholdStartdato,
                        institusjonOppholdSluttdato,
                    },
                },
            },
        } = result;

        expect(institusjonsnavn.verdi).toEqual('');
        expect(institusjonsadresse.verdi).toEqual('');
        expect(institusjonspostnummer.verdi).toEqual('');
        expect(institusjonOppholdStartdato.verdi).toEqual('');
        expect(institusjonOppholdSluttdato.verdi).toEqual('');
        expect(institusjonsnavn.erSynlig).toEqual(false);
        expect(institusjonsadresse.erSynlig).toEqual(false);
        expect(institusjonspostnummer.erSynlig).toEqual(false);
        expect(institusjonOppholdStartdato.erSynlig).toEqual(false);
        expect(institusjonOppholdSluttdato.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('Setter opphold i Norge-felter til tomme dersom barnet har oppholdt seg i Norge siste 12 mnd', async () => {
        const barn: Partial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: { planleggerÅBoINorge12Mnd },
                },
            },
        } = result;

        expect(planleggerÅBoINorge12Mnd.verdi).toEqual(null);
        expect(planleggerÅBoINorge12Mnd.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('Fjerner at man skal oppgi andre foreldrens fødselsnummer når man ikke vil oppgi personopplysninger', async () => {
        const barn: DeepPartial<IBarnMedISøknad> = {
            ...genererInitialBarnMedISøknad(barnFraPdl),
            andreForelder: {
                ...genererInitiellAndreForelder(null, false),
                [andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger]: {
                    svar: ESvar.JA,
                    id: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
                },
            },
            [barnDataKeySpørsmål.erFosterbarn]: {
                svar: ESvar.NEI,
                id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
            },
        };

        spyOnUseApp({ barnInkludertISøknaden: [barn] });

        const { result } = renderHook(
            () => {
                return useOmBarnet('random-id-1');
            },
            { wrapper: TestProvidere }
        );

        const {
            current: {
                skjema: {
                    felter: {
                        andreForelderNavn,
                        andreForelderKanIkkeGiOpplysninger,
                        andreForelderFnr,
                    },
                },
            },
        } = result;

        expect(andreForelderNavn.verdi).toEqual('');
        expect(andreForelderNavn.erSynlig).toEqual(true);
        expect(andreForelderKanIkkeGiOpplysninger.erSynlig).toEqual(true);
        expect(andreForelderKanIkkeGiOpplysninger.verdi).toEqual(ESvar.JA);
        expect(andreForelderFnr.erSynlig).toEqual(false);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });
});
