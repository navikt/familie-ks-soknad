import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { HttpProvider } from '@navikt/familie-http';
import { byggDataRessurs } from '@navikt/familie-typer';
import * as fnrvalidator from '@navikt/fnrvalidator';

import * as appContext from '../../../../context/AppContext';
import { silenceConsoleErrors } from '../../../../utils/testing';
import LeggTilBarnModal from './LeggTilBarnModal';
import { NyttBarnKort } from './NyttBarnKort';

silenceConsoleErrors();

jest.mock('../../../../context/AppContext');
jest.mock('@navikt/fnrvalidator');

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/velg-barn/',
    }),
}));

test(`Kan legge til barn`, async () => {
    const submitMock = jest.fn();
    jest.spyOn(appContext, 'useApp').mockImplementation(
        jest.fn().mockReturnValue({
            søknad: { barnRegistrertManuelt: [], søker: { barn: [] } },
            settSøknad: submitMock,
            axiosRequest: jest.fn().mockResolvedValue(byggDataRessurs(false)),
            mellomlagre: jest.fn(),
        })
    );
    jest.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });
    const åpen: number[] = [];

    const { getByRole, getByText, getByLabelText, rerender } = render(
        <IntlProvider locale={'nb'}>
            <HttpProvider>
                <NyttBarnKort
                    onLeggTilBarn={() => {
                        åpen.push(1);
                    }}
                />
                <LeggTilBarnModal
                    erÅpen={åpen.length > 0}
                    toggleModal={() => {
                        åpen.pop();
                    }}
                />
            </HttpProvider>
        </IntlProvider>
    );

    const leggTilBarnKort = getByRole('button');
    expect(leggTilBarnKort).toBeInTheDocument();
    act(() => leggTilBarnKort.click());

    rerender(
        <IntlProvider locale={'nb'}>
            <HttpProvider>
                <NyttBarnKort
                    onLeggTilBarn={() => {
                        åpen.push(1);
                    }}
                />
                <LeggTilBarnModal
                    erÅpen={åpen.length > 0}
                    toggleModal={() => {
                        åpen.pop();
                    }}
                />
            </HttpProvider>
        </IntlProvider>
    );

    const modal = await waitFor(() => getByLabelText('hvilkebarn.leggtilbarn.modal.tittel'));
    const leggTilKnappIModal = modal.querySelector('button');
    expect(leggTilKnappIModal).toBeInTheDocument();
    expect(leggTilKnappIModal).toHaveClass('navds-button--secondary');

    const erFødt = getByText('hvilkebarn.leggtilbarn.barnfødt.spm');
    expect(erFødt).toBeInTheDocument();

    // Språktekst-id for Ja er 'ja'
    const jaKnapp = getByText('felles.svaralternativ.ja');
    act(() => jaKnapp.click());

    const fornavnLabel = getByText('hvilkebarn.leggtilbarn.fornavn.spm');
    const etternavnLabel = getByText('hvilkebarn.leggtilbarn.etternavn.spm');
    const idnrLabel = getByText('felles.fødsels-eller-dnummer.label');
    expect(fornavnLabel).toBeInTheDocument();
    expect(etternavnLabel).toBeInTheDocument();
    expect(idnrLabel).toBeInTheDocument();
    const fornavnInput = fornavnLabel.nextElementSibling || new Element();
    const etternavnInput = etternavnLabel.nextElementSibling || new Element();
    const idnrInput = idnrLabel.nextElementSibling || new Element();

    act(() => {
        fireEvent.input(fornavnInput, { target: { value: 'Sirius' } });
        fireEvent.input(etternavnInput, { target: { value: 'Svaart' } });
        fireEvent.input(idnrInput, { target: { value: '031159123456' } });
    });

    expect(leggTilKnappIModal).toHaveClass('navds-button--primary');

    // Her skjer det async kall med axios, som vi må vente på i de neste expectene
    act(() => leggTilKnappIModal?.click());
    await waitFor(() => expect(åpen.length).toBe(0));

    rerender(
        <IntlProvider locale={'nb'}>
            <HttpProvider>
                <NyttBarnKort
                    onLeggTilBarn={() => {
                        åpen.push(1);
                    }}
                />
                <LeggTilBarnModal
                    erÅpen={åpen.length > 0}
                    toggleModal={() => {
                        åpen.pop();
                    }}
                />
            </HttpProvider>
        </IntlProvider>
    );

    await waitFor(() => expect(modal).not.toBeInTheDocument());
    await waitFor(() => expect(submitMock.mock.calls.length).toBe(1));
});
