import React from 'react';

import { act, render } from '@testing-library/react';

import { silenceConsoleErrors, TestProvidere } from '../../../../utils/testing';
import LeggTilBarnModal from './LeggTilBarnModal';

describe('LeggTilBarnModal', function () {
    test('Test at advarsel om fnr vises hvis man huker av for at barnet ikke har fått fnr enda', () => {
        silenceConsoleErrors();
        const { getByText } = render(
            <TestProvidere>
                <LeggTilBarnModal erÅpen={true} toggleModal={jest.fn()} />
            </TestProvidere>
        );
        const erFødtJa = getByText(/felles.svaralternativ.ja/);
        act(() => erFødtJa.click());
        const harIkkFnrCheckbox = getByText(/hvilkebarn.leggtilbarn.ikke-fått-fnr.spm/);
        act(() => harIkkFnrCheckbox.click());

        const advarsel = getByText(/hvilkebarn.leggtilbarn.ikke-fått-fnr.alert/);
        expect(advarsel).toBeInTheDocument();
    });
});
