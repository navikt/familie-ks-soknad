import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { act } from 'react-dom/test-utils';

import { ESvar } from '@navikt/familie-form-elements';

import { ISøknad } from '../../../typer/søknad';
import {
    mekkGyldigSøknad,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../OmDeg/spørsmål';
import Oppsummering from './Oppsummering';

describe('Oppsummering', () => {
    beforeEach(silenceConsoleErrors);

    it('Alle tekster finnes i språkfil', async () => {
        mockHistory(['/oppsummering']);
        spyOnUseApp(mekkGyldigSøknad());

        const { findAllByRole } = render(
            <TestProvidereMedEkteTekster>
                <Oppsummering />
            </TestProvidereMedEkteTekster>
        );
        await findAllByRole('button');

        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('stopper fra å gå videre hvis søknaden har mangler', async () => {
        const søknad = mockDeep<ISøknad>({
            erAvdødPartnerForelder: {
                id: OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
                svar: null,
            },
            søker: {
                statsborgerskap: [{ landkode: 'NOR' }],
                værtINorgeITolvMåneder: { id: OmDegSpørsmålId.værtINorgeITolvMåneder, svar: null },
            },
            barnInkludertISøknaden: [
                {
                    ident: '1234',
                    institusjonsnavn: { id: OmBarnetSpørsmålsId.institusjonsnavn, svar: '' },
                    institusjonsadresse: { id: OmBarnetSpørsmålsId.institusjonsadresse, svar: '' },
                    erFosterbarn: { id: OmBarnaDineSpørsmålId.hvemErFosterbarn, svar: ESvar.JA },
                    andreForelder: null,
                    utenlandsperioder: [],
                    triggetEøs: false,
                },
            ],
        });
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/oppsummering']);

        const { findByText, getAllByRole } = render(
            <TestProvidere>
                <Oppsummering />
            </TestProvidere>
        );
        const gåVidere = await findByText('felles.navigasjon.gå-videre');

        await act(() => gåVidere.click());

        const omDegFeil = getAllByRole('alert')[0];
        expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual({
            hash: 'omdeg-feil',
        });
        expect(omDegFeil).toBeInTheDocument();
        expect(omDegFeil).toBeVisible();
    }, 10000);

    it('går til dokumentasjon med gyldig søknad', async () => {
        const søknad = mekkGyldigSøknad();
        spyOnUseApp(søknad);
        const { mockedHistoryArray } = mockHistory(['/oppsummering']);

        const { findByText, queryAllByRole } = render(
            <TestProvidere>
                <Oppsummering />
            </TestProvidere>
        );
        const gåVidere = await findByText('felles.navigasjon.gå-videre');

        await act(() => gåVidere.click());

        expect(queryAllByRole('alert').length).toBe(0);
        await waitFor(() =>
            expect(mockedHistoryArray[mockedHistoryArray.length - 1]).toEqual('/dokumentasjon')
        );
    });
});
