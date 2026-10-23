import { render, screen } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import type { IBarnMedISøknad } from '../../../typer/barn';
import { ESanityFlettefeltverdi } from '../../../typer/sanity/sanity';
import type { ISøknad } from '../../../typer/søknad';
import { lagTekstProxy, spyOnUseApp, TestProvidere } from '../../../utils/testing';

import { OmBarnetHeader } from './OmBarnetHeader';

const barnXAvY = {
    nb: [
        {
            _type: 'block',
            _key: 'barnXAvY',
            style: 'normal',
            markDefs: [],
            children: [
                { _type: 'flettefelt', _key: 'antall', flettefelt: ESanityFlettefeltverdi.ANTALL },
                { _type: 'span', _key: 'av', text: ' av ', marks: [] },
                { _type: 'flettefelt', _key: 'totalAntall', flettefelt: ESanityFlettefeltverdi.TOTAL_ANTALL },
            ],
        },
    ],
};

describe('OmBarnetHeader', () => {
    it(`rendrer 1 av 2 og 2 av 2 i den rekkefølgen`, () => {
        const barn = mockDeep<IBarnMedISøknad[]>([{ id: 'testbarn-1' }, { id: 'testbarn-2' }]);
        const søknadsMock = mockDeep<ISøknad>({
            barnInkludertISøknaden: barn,
        });
        const { tekster } = spyOnUseApp(søknadsMock);
        tekster.mockReturnValue(lagTekstProxy({ 'OM_BARNET.barnXAvY': barnXAvY }));

        const { rerender } = render(
            <TestProvidere>
                <OmBarnetHeader barn={barn[0]} />
            </TestProvidere>
        );

        expect(screen.getByRole('heading', { name: '1 av 2' })).toBeInTheDocument();

        rerender(
            <TestProvidere>
                <OmBarnetHeader barn={barn[1]} />
            </TestProvidere>
        );

        expect(screen.getByRole('heading', { name: '2 av 2' })).toBeInTheDocument();
    });
});
