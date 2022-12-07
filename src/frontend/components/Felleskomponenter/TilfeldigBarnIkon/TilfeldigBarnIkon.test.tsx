import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ISøknad } from '../../../typer/søknad';
import * as hjelpefunksjoner from '../../../utils/hjelpefunksjoner';
import { spyOnModal, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import { TilfeldigBarnIkon } from './TilfeldigBarnIkon';

describe('TilfeldigBarnIkon', () => {
    beforeEach(() => {
        spyOnModal();
        spyOnUseApp({});
    });

    it('velger nytt ikon ved rerender by default', () => {
        const spy = jest.spyOn(hjelpefunksjoner, 'randomIntFraIntervall');
        const { rerender } = render(
            <TestProvidere>
                <TilfeldigBarnIkon />
            </TestProvidere>
        );

        // 2 ved første render, 1 for initiell useState, som ignoreres videre
        expect(spy.mock.calls.length).toEqual(2);

        rerender(
            <TestProvidere>
                <TilfeldigBarnIkon />
            </TestProvidere>
        );
        expect(spy.mock.calls.length).toEqual(3);

        rerender(
            <TestProvidere>
                <TilfeldigBarnIkon />
            </TestProvidere>
        );
        expect(spy.mock.calls.length).toEqual(4);
    });

    it('kan låse barnikon mellom rerenders med prop', () => {
        const spy = jest.spyOn(hjelpefunksjoner, 'randomIntFraIntervall');
        spyOnUseApp(mockDeep<ISøknad>({ barnInkludertISøknaden: [{ id: '1' }, { id: '2' }] }));

        const { rerender } = render(
            <TestProvidere>
                <TilfeldigBarnIkon byttVedRerender={false} />
            </TestProvidere>
        );
        expect(spy.mock.calls.length).toEqual(1);

        rerender(
            <TestProvidere>
                <TilfeldigBarnIkon byttVedRerender={false} />
            </TestProvidere>
        );
        expect(spy.mock.calls.length).toEqual(1);
    });
});
