import React from 'react';

import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ISøknad } from '../../../typer/søknad';
import * as hjelpefunksjoner from '../../../utils/hjelpefunksjoner';
import { spyOnUseApp } from '../../../utils/testing';

import { TilfeldigBarnIkon } from './TilfeldigBarnIkon';

describe('TilfeldigBarnIkon', () => {
    beforeEach(() => {
        spyOnUseApp({});
    });

    it('velger nytt ikon ved rerender by default', () => {
        const spy = vi.spyOn(hjelpefunksjoner, 'randomIntFraIntervall');
        const { rerender } = render(<TilfeldigBarnIkon />);

        // 2 ved første render, 1 for initiell useState, som ignoreres videre
        expect(spy.mock.calls.length).toEqual(2);

        rerender(<TilfeldigBarnIkon />);
        expect(spy.mock.calls.length).toEqual(3);

        rerender(<TilfeldigBarnIkon />);
        expect(spy.mock.calls.length).toEqual(4);
    });

    it('kan låse barnikon mellom rerenders med prop', () => {
        const spy = vi.spyOn(hjelpefunksjoner, 'randomIntFraIntervall');
        spyOnUseApp(mockDeep<ISøknad>({ barnInkludertISøknaden: [{ id: '1' }, { id: '2' }] }));

        const { rerender } = render(<TilfeldigBarnIkon byttVedRerender={false} />);
        expect(spy.mock.calls.length).toEqual(1);

        rerender(<TilfeldigBarnIkon byttVedRerender={false} />);
        expect(spy.mock.calls.length).toEqual(1);
    });
});
