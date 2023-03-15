import React from 'react';

import { act, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { DeepPartial } from 'ts-essentials';

import { ESvar } from '@navikt/familie-form-elements';
import { RessursStatus } from '@navikt/familie-typer';

import * as pdlRequest from '../../../context/pdl';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { IBarnRespons, ISøkerRespons } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import {
    mekkGyldigSøker,
    mockEøs,
    mockFeatureToggle,
    mockHistory,
    mockRoutes,
    spyOnModal,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import VelgBarn from './VelgBarn';

jest.mock('@navikt/fnrvalidator');

jest.mock('@sanity/client', () => {
    return function sanity() {
        return {
            fetch: () => ({
                then: () => ({
                    catch: jest.fn(),
                }),
            }),
        };
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => jest.fn(),
}));

const manueltRegistrert: Partial<IBarnMedISøknad> = {
    id: 'random-id-1',
    ident: '12345',
    navn: 'A',
    utenlandsperioder: [],
    [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
};
const fraPdl: Partial<IBarnRespons> = {
    ident: '54321',
    navn: 'B',
};

const fraPdlSomIBarnMedISøknad: Partial<IBarnMedISøknad> = {
    ...fraPdl,
    navn: fraPdl.navn ?? 'ukjent',
    id: 'random-id-2',
    utenlandsperioder: [],
    [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
};

describe('VelgBarn', () => {
    beforeEach(() => {
        mockHistory(['/velg-barn']);
        jest.spyOn(pdlRequest, 'hentSluttbrukerFraPdl').mockImplementation(async () => ({
            status: RessursStatus.SUKSESS,
            data: mockDeep<ISøkerRespons>({
                sivilstand: { type: ESivilstand.UGIFT },
            }),
        }));
        mockEøs();
        mockRoutes();
        mockFeatureToggle();
        spyOnModal();
    });

    test('Kan fjerne manuelt registrerte barn', () => {
        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarnMedISøknad],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
            erEøs: false,
        };
        const { settSøknad } = spyOnUseApp(søknad);

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { queryByTestId } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = queryByTestId('fjern-barn-knapp');

        act(() => fjernBarnKnapp?.click());

        const gåVidere = queryByTestId('gå-videre-knapp');
        act(() => gåVidere?.click());

        // Først blir barnet fjernet fra manuelt registrerte barn
        expect(settSøknad).toHaveBeenNthCalledWith(1, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarnMedISøknad],
            søker: {
                ...mekkGyldigSøker(),
                barn: [fraPdl],
            },
            dokumentasjon: [],
            erEøs: false,
        });

        // Når man trykker på gå videre blir det manuelt registrerte barnet fjernet fra søknaden
        expect(settSøknad).toHaveBeenNthCalledWith(2, {
            barnRegistrertManuelt: [],
            barnInkludertISøknaden: [fraPdlSomIBarnMedISøknad],
            søker: {
                ...mekkGyldigSøker(),
                barn: [fraPdl],
            },
            dokumentasjon: [],
            erEøs: false,
        });
    });
    test('Rendrer ikke navn eller fnr på barnekort dersom det har adressebeskyttelse', () => {
        const søknad = mockDeep<ISøknad>({
            søker: {
                barn: [
                    {
                        adressebeskyttelse: true,
                        ident: '12345678901',
                    },
                ],
            },
            barnInkludertISøknaden: [],
        });

        spyOnUseApp(søknad);

        const { queryByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const ident = queryByText(søknad.søker.barn[0].ident ?? 'finnes-ikke-kast-feil');
        const navn = queryByText(søknad.søker.barn[0].navn ?? 'finnes-ikke-kast-feil');

        expect(ident).not.toBeInTheDocument();
        expect(navn).not.toBeInTheDocument();
    });

    test('Kan huke av for barn', () => {
        const søknad: DeepPartial<ISøknad> = {
            søker: {
                barn: [
                    {
                        navn: 'Jens',
                        ident: '12345',
                        adressebeskyttelse: false,
                        borMedSøker: true,
                        alder: '2 år',
                    },
                ],
            },
            barnRegistrertManuelt: [],
        };
        spyOnUseApp(søknad);

        const { queryByTestId } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const checkbox: HTMLInputElement = queryByTestId('velg-barn-checkbox') as HTMLInputElement;
        act(() => checkbox.click());

        expect(checkbox.checked).toBe(true);
    });
});
