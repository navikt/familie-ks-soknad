import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import {
    genererOppdaterteBarn,
    genererSvarForSpørsmålBarn,
} from '../components/SøknadsSteg/OmBarnaDine/utils';
import { IBarnMedISøknad } from '../typer/barn';
import { IOmBarnaDineFeltTyper } from '../typer/skjema';
import { ISøknad } from '../typer/søknad';

describe('genererSvarForSpørsmålBarn', () => {
    const mockBarn = mockDeep<IBarnMedISøknad>({ id: 'random-id' });
    const mockFeltSomInkludererBarn = mockDeep<Felt<string[]>>({ verdi: ['random-id'] });
    const mockFeltSomIkkeInkludererBarn = mockDeep<Felt<string[]>>({
        verdi: ['random-id-1', 'random-id-2'],
    });

    test('Returner JA dersom barn er inkludert i feltets verdi (array)', () => {
        expect(genererSvarForSpørsmålBarn(mockBarn, mockFeltSomInkludererBarn)).toEqual('JA');
    });
    test('Returner NEI dersom barn ikke er inkludert i feltets verdi (array)', () => {
        expect(genererSvarForSpørsmålBarn(mockBarn, mockFeltSomIkkeInkludererBarn)).toEqual('NEI');
    });
});

describe('genererOppdaterteBarn', () => {
    const mockSøknad = mockDeep<ISøknad>({
        barnInkludertISøknaden: [
            {
                id: 'random-id',
                idNummer: [],
                utenlandsperioder: [],
                eøsKontantstøttePerioder: [],
                planleggerÅBoINorge12Mnd: { svar: ESvar.JA },
            },
        ],
    });

    const mockSkjema = mockDeep<ISkjema<IOmBarnaDineFeltTyper, string>>({
        felter: {
            hvemErFosterbarn: { verdi: ['random-id'] },
            hvemErSøktAsylFor: { verdi: ['random-id'] },
            hvemErAdoptert: { verdi: [] },
            hvemOppholderSegIInstitusjon: { verdi: [] },
            hvemTolvMndSammenhengendeINorge: { verdi: [] },
            hvemKontantstøtteFraAnnetEøsland: { verdi: ['random-id'] },
            erNoenAvBarnaFosterbarn: {
                verdi: ESvar.JA,
            },
            oppholderBarnSegIInstitusjon: {
                verdi: ESvar.NEI,
            },
            erBarnAdoptert: {
                verdi: ESvar.NEI,
            },
            søktAsylForBarn: {
                verdi: ESvar.JA,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                verdi: ESvar.NEI,
            },
            mottarKontantstøtteForBarnFraAnnetEøsland: {
                verdi: ESvar.JA,
            },
        },
    });

    test('Returner objekt med barn, med forventede verdier', () => {
        const barn = genererOppdaterteBarn(mockSøknad, mockSkjema, _barn => false, vi.fn());

        expect(barn[0].id).toBe('random-id');
        expect(barn[0].erFosterbarn.svar).toBe('JA');
        expect(barn[0].erAsylsøker.svar).toBe('JA');
        expect(barn[0].erAdoptert.svar).toBe('NEI');
        expect(barn[0].oppholderSegIInstitusjon.svar).toBe('NEI');
        expect(barn[0].boddMindreEnn12MndINorge.svar).toBe('NEI');
        expect(barn[0].kontantstøtteFraAnnetEøsland.svar).toBe('JA');
        expect(barn[0].planleggerÅBoINorge12Mnd.svar).toBe(null);
    });
});
