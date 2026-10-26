import { render } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import type { ISøker } from '../../../typer/person';
import { spyOnUseApp, spørsmålFinnes, TestProvidere, ventPåSpørsmål } from '../../../utils/testing';

import OmDeg from './OmDeg';
import { OmDegSpørsmålId } from './spørsmål';

const borPåAdressen = 'OM_DEG.borPaaAdressen.sporsmal';
const oppholdtDegSammenhengende = 'OM_DEG.oppholdtDegSammenhengende.sporsmal';

const TestKomponent = () => (
    <TestProvidere>
        <OmDeg />
    </TestProvidere>
);

describe('OmDeg', () => {
    test('Kan gå videre i søknad ved adresse som er ukjent, får ikke spm om bosted, men opphold i norge', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        render(<TestKomponent />);

        expect(await ventPåSpørsmål(oppholdtDegSammenhengende)).toBeInTheDocument();
        expect(spørsmålFinnes(borPåAdressen)).toBe(false);
    });

    test('Søker med adresse får opp to spørsmål med en gang', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
                borPåRegistrertAdresse: { id: OmDegSpørsmålId.borPåRegistrertAdresse, svar: null },
                værtINorgeITolvMåneder: { id: OmDegSpørsmålId.værtINorgeITolvMåneder, svar: null },
                yrkesaktivFemÅr: { id: OmDegSpørsmålId.yrkesaktivFemÅr, svar: null },
            }),
        });
        render(<TestKomponent />);

        expect(await ventPåSpørsmål(borPåAdressen)).toBeInTheDocument();
        expect(await ventPåSpørsmål(oppholdtDegSammenhengende)).toBeInTheDocument();
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        render(<TestKomponent />);

        expect(await ventPåSpørsmål(oppholdtDegSammenhengende)).toBeInTheDocument();
        expect(spørsmålFinnes(borPåAdressen)).toBe(false);
    });
});
