import React from 'react';

import { act, render } from '@testing-library/react';

import { ESivilstand } from '../../../../typer/kontrakt/generelle';
import { IBarn } from '../../../../typer/person';
import {
    mekkGyldigSøker,
    mockEøs,
    spyOnModal,
    spyOnUseApp,
    TestProvidere,
} from '../../../../utils/testing';
import VelgBarn from '../VelgBarn';

describe('FjernBarnKnapp', () => {
    beforeEach(() => {
        mockEøs();
        spyOnModal();
    });

    test(`Fjern-knapp dukker kun opp på manuelt registrerte barn`, () => {
        const registrertBarn: IBarn = {
            id: 'random-id-manuell',
            ident: '12345',
            navn: 'Test',
            borMedSøker: true,
            alder: null,
            erUnder11Mnd: false,
            adressebeskyttelse: false,
        };
        const pdlBarn: IBarn = {
            id: 'random-id-pdl',
            ident: '54321',
            navn: 'Også test',
            borMedSøker: true,
            alder: null,
            erUnder11Mnd: false,
            adressebeskyttelse: false,
        };

        spyOnUseApp({
            barnInkludertISøknaden: [],
            søker: {
                barn: [pdlBarn],
            },
            barnRegistrertManuelt: [registrertBarn],
        });
        const { queryAllByTestId } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const antallBarnekortTilsammen = queryAllByTestId('velg-barn-checkbox');
        expect(antallBarnekortTilsammen?.length).toBe(2);

        const fjernKnapper = queryAllByTestId('fjern-barn-knapp');
        expect(fjernKnapper.length).toBe(1);
    });

    test('Kan fjerne barn', () => {
        const registrertBarn: IBarn = {
            id: 'random-id',
            ident: '12345',
            navn: 'Test',
            borMedSøker: true,
            alder: null,
            erUnder11Mnd: false,
            adressebeskyttelse: false,
        };

        const { settSøknad } = spyOnUseApp({
            barnInkludertISøknaden: [],
            søker: {
                barn: [],
            },
            barnRegistrertManuelt: [registrertBarn],
            dokumentasjon: [],
        });
        const { queryByTestId } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernKnapp = queryByTestId('fjern-barn-knapp');
        act(() => fjernKnapp?.click());

        expect(settSøknad).toHaveBeenCalledTimes(1);
        expect(settSøknad).toHaveBeenCalledWith({
            barnInkludertISøknaden: [],
            barnRegistrertManuelt: [],
            erEøs: false,
            dokumentasjon: [],
            søker: {
                ...mekkGyldigSøker(),
                barn: [],
                sivilstand: { type: ESivilstand.UGIFT },
            },
        });
    });
});
