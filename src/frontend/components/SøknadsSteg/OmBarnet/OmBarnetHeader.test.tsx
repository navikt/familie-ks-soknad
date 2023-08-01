import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { IBarnMedISøknad } from '../../../typer/barn';
import { ISøknad } from '../../../typer/søknad';
import { spyOnModal, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import { OmBarnetHeader } from './OmBarnetHeader';

describe('OmBarnetHeader', () => {
    beforeEach(() => {
        spyOnModal();
    });

    it(`rendrer 1 av 2 og 2 av 2 i den rekkefølgen`, () => {
        const barn = mockDeep<IBarnMedISøknad[]>([{ id: 'testbarn-1' }, { id: 'testbarn-2' }]);
        const søknadsMock = mockDeep<ISøknad>({
            barnInkludertISøknaden: barn,
        });
        spyOnUseApp(søknadsMock);

        const { queryByTestId, rerender } = render(
            <TestProvidere>
                <OmBarnetHeader barn={barn[0]} />
            </TestProvidere>
        );

        expect(queryByTestId('testbarn-1')).toBeInTheDocument();

        rerender(
            <TestProvidere>
                <OmBarnetHeader barn={barn[1]} />
            </TestProvidere>
        );

        expect(queryByTestId('testbarn-2')).toBeInTheDocument();
    });
});
