import React from 'react';

import { render } from '@testing-library/react';
import { Alpha3Code } from 'i18n-iso-countries';
import { mockDeep } from 'jest-mock-extended';

import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import { mockEøs, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import { LandDropdown } from './LandDropdown';

describe('LandDropdown', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        spyOnUseApp({});
    });

    it('Rendrer alle land i alle dropdowns når eøs er skrudd av', async () => {
        mockEøs();
        const felt = mockDeep<Felt<'' | Alpha3Code>>({
            erSynlig: true,
            id: 'test-id',
        });
        const skjema = mockDeep<ISkjema<SkjemaFeltTyper, string>>();

        const { findAllByRole, unmount } = render(
            <TestProvidere>
                <LandDropdown felt={felt} skjema={skjema} />
            </TestProvidere>
        );

        let options = await findAllByRole('option');

        const antallLand = 251;

        expect(options).toHaveLength(antallLand);
        unmount();

        render(
            <TestProvidere>
                <LandDropdown felt={felt} skjema={skjema} />
            </TestProvidere>
        );

        options = await findAllByRole('option');

        expect(options).toHaveLength(antallLand);
    }, /* Denne testen trenger litt ekstra tid pga unmount, vanligvis rundt 6s */ 12000);

    it('Rendrer kun EØS-land når EØS er på og kunEøs-prop er true', async () => {
        const { erEøsLand } = mockEøs();
        erEøsLand.mockImplementation(landKode => ['BEL', 'AFG'].includes(landKode));

        const felt = mockDeep<Felt<'' | Alpha3Code>>({
            erSynlig: true,
            id: 'test-id',
        });
        const skjema = mockDeep<ISkjema<SkjemaFeltTyper, string>>();

        const { findAllByRole } = render(
            <TestProvidere>
                <LandDropdown felt={felt} skjema={skjema} kunEøs />
            </TestProvidere>
        );

        const options = await findAllByRole('option');

        expect(options).toHaveLength(3);
    });
});
