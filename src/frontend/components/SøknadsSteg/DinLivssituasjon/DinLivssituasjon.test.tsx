import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { ISøknad } from '../../../typer/søknad';
import {
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import DinLivssituasjon from './DinLivssituasjon';

const søknad = mockDeep<ISøknad>({
    barnInkludertISøknaden: [
        {
            ident: '1234',
        },
    ],
    søker: {
        sivilstand: { type: ESivilstand.UGIFT },
    },
});

describe('DinLivssituasjon', () => {
    mockHistory(['/din-livssituasjon']);

    beforeEach(() => {
        silenceConsoleErrors();
        mockEøs();
        jest.useFakeTimers('modern');
    });

    it('Alle tekster finnes i språkfil', async () => {
        spyOnUseApp(søknad);

        render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(console.error).toHaveBeenCalledTimes(0);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
    });

    it('rendrer DinLivssituasjon steg og inneholder sidetittel', async () => {
        spyOnUseApp(søknad);

        const { findByText } = render(
            <TestProvidereMedEkteTekster>
                <DinLivssituasjon />
            </TestProvidereMedEkteTekster>
        );
        expect(await findByText('Livssituasjonen din')).toBeInTheDocument();
    });
});
