import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ISøker } from '../../../typer/person';
import { mockEøs, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import OmDeg from './OmDeg';
import { OmDegSpørsmålId } from './spørsmål';

const TestKomponent = () => (
    <TestProvidere>
        <OmDeg />
    </TestProvidere>
);

describe('OmDeg', () => {
    beforeEach(() => {
        mockEøs();
    });

    test('Skal rendre 2 alertstriper i OmDeg', async () => {
        spyOnUseApp({ søker: mockDeep<ISøker>({ statsborgerskap: [] }) });
        const { container } = render(
            <TestProvidere>
                <OmDeg />
            </TestProvidere>
        );
        expect(container.getElementsByClassName('navds-alert')).toHaveLength(2);
    });

    test('Kan gå videre i søknad ved adresse som er ukjent, får ikke spm om bosted, men opphold i norge', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { container, queryByTestId } = render(<TestKomponent />);
        // Lar async useEffect i AppContext bli ferdig
        await container.getElementsByClassName('navds-alert');
        expect(queryByTestId(OmDegSpørsmålId.borPåRegistrertAdresse)).not.toBeInTheDocument();
        expect(queryByTestId(OmDegSpørsmålId.værtINorgeITolvMåneder)).toBeInTheDocument();
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
        const { queryByTestId } = render(<TestKomponent />);

        expect(queryByTestId(OmDegSpørsmålId.borPåRegistrertAdresse)).toBeInTheDocument();
        expect(queryByTestId(OmDegSpørsmålId.værtINorgeITolvMåneder)).toBeInTheDocument();
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByTestId, container } = render(<TestKomponent />);
        // Lar async useEffect i AppContext bli ferdig
        await container.getElementsByClassName('navds-alert');

        expect(queryByTestId(OmDegSpørsmålId.borPåRegistrertAdresse)).not.toBeInTheDocument();

        expect(queryByTestId(OmDegSpørsmålId.værtINorgeITolvMåneder)).toBeInTheDocument();
    });
});
