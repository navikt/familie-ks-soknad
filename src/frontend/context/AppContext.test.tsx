import { renderHook, type RenderHookResult, act } from '@testing-library/react';

import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESivilstand } from '../typer/kontrakt/generelle';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { TestProvidere } from '../utils/testing';

import { useAppContext } from './AppContext';

const søknadEtterRespons: ISøknad = {
    ...initialStateSøknad,
    søker: {
        ...initialStateSøknad.søker,
        ident: '12345678910',
        navn: 'Navn navnesen',
        barn: [],
        statsborgerskap: [{ landkode: 'DZA' }],
        adresse: { adressenavn: 'Heiveien 32' },
        sivilstand: { type: ESivilstand.UGIFT },
    },
};

describe('AppContext', () => {
    let hookResult: RenderHookResult<ReturnType<typeof useAppContext>, unknown>;

    beforeEach(() => {
        hookResult = renderHook(() => useAppContext(), {
            wrapper: TestProvidere,
        });
    });

    describe('erStegUtfyltFraFør', () => {
        test('Skal returnere true dersom siste utfylte steg er det samme som nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.result.current;
            await act(() => settSisteUtfylteStegIndex(2));
            expect(hookResult.result.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
        });

        test('Skal returnere true dersom siste utfylte steg er etter nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.result.current;
            await act(() => settSisteUtfylteStegIndex(3));
            expect(hookResult.result.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
        });

        test('Skal returnere false dersom siste utfylte steg er før nåværende steg', async () => {
            const nåværendeStegIndex = 2;
            const { settSisteUtfylteStegIndex } = hookResult.result.current;
            await act(() => settSisteUtfylteStegIndex(1));
            expect(hookResult.result.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(false);
        });
    });

    describe('nullstillSøknadsObject', () => {
        test('Skal nullstille søknadsobjekt bortsett fra person hentet fra backend og søknadstype', async () => {
            const søknadHalvveisUtfylt: ISøknad = {
                ...søknadEtterRespons,
                erNoenAvBarnaFosterbarn: {
                    id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
                    svar: ESvar.JA,
                },
                oppholderBarnSegIInstitusjon: {
                    id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
                    svar: ESvar.JA,
                },
                erBarnAdoptert: {
                    id: OmBarnaDineSpørsmålId.erBarnAdoptert,
                    svar: ESvar.JA,
                },
            };

            await act(() => hookResult.result.current.settSøknad(søknadHalvveisUtfylt));
            expect(hookResult.result.current.søknad).toEqual(søknadHalvveisUtfylt);
            act(() => hookResult.result.current.nullstillSøknadsobjekt());
            expect(hookResult.result.current.søknad).toEqual(søknadEtterRespons);
        });
    });

    describe('avbrytOgSlettSøknad', () => {
        test('Ved avbryt skal sisteUtfylteStegIndex settes til -1', async () => {
            hookResult.result.current.sisteUtfylteStegIndex = 3;
            act(() => hookResult.result.current.avbrytOgSlettSøknad());
            expect(hookResult.result.current.sisteUtfylteStegIndex).toEqual(-1);
        });
    });
});
