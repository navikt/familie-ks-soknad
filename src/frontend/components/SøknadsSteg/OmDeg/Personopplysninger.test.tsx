import React from 'react';

import { render } from '@testing-library/react';

import { Personopplysninger } from './Personopplysninger';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { ISøker } from '../../../typer/person';
import { mockEøs, spyOnModal, spyOnUseApp, TestProvidere } from '../../../utils/testing';

const mockedSivilstand = ESivilstand.GIFT;

describe('Personopplysninger', () => {
    beforeEach(() => {
        mockEøs();
        spyOnModal();
    });
    test('Rendrer adresse i personopplysninger', async () => {
        const søker: Partial<ISøker> = {
            adresse: {
                adressenavn: 'Testgata',
                poststed: 'Oslo',
            },
            navn: 'Test Testdottir',
            statsborgerskap: [{ landkode: 'NOR' }],
            ident: '12345678901',
            barn: [],
            sivilstand: { type: mockedSivilstand },
        };

        spyOnUseApp({ søker });

        const { getByText } = render(
            <TestProvidere>
                <Personopplysninger />
            </TestProvidere>
        );
        expect(getByText(/Testgata/)).toBeInTheDocument();
        expect(getByText(/Oslo/)).toBeInTheDocument();
    });
});
