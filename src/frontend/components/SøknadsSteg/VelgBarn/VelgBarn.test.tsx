import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';
import { DeepPartial } from 'ts-essentials';

import { ESvar } from '@navikt/familie-form-elements';
import { byggSuksessRessurs, RessursStatus } from '@navikt/familie-typer';
import fnrvalidator from '@navikt/fnrvalidator';

import * as eøsContext from '../../../context/EøsContext';
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
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
} from '../../../utils/testing';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import VelgBarn from './VelgBarn';

jest.mock('@navikt/fnrvalidator');

const manueltRegistrert: Partial<IBarnMedISøknad> = {
    id: 'random-id-1',
    ident: '12345',
    navn: 'A',
    utenlandsperioder: [],
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
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
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: ESvar.NEI,
    },
};

describe('VelgBarn', () => {
    beforeEach(() => {
        mockHistory(['/velg-barn']);
        jest.spyOn(eøsContext, 'useEøs').mockImplementation(jest.fn());
        jest.spyOn(pdlRequest, 'hentSluttbrukerFraPdl').mockImplementation(async () => ({
            status: RessursStatus.SUKSESS,
            data: mockDeep<ISøkerRespons>({
                sivilstand: { type: ESivilstand.UGIFT },
            }),
        }));
        mockEøs();
        mockRoutes();
        mockFeatureToggle();
        silenceConsoleErrors();
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

        const { getByText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);

        act(() => fjernBarnKnapp.click());

        const gåVidere = getByText(/felles.navigasjon.gå-videre/);
        act(() => gåVidere.click());

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
    test('Rendrer anonymt barnekort dersom det har adressebeskyttelse', () => {
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
        const infoTekst = queryByText(/hvilkebarn.barn.bosted.adressesperre/);

        expect(ident).not.toBeInTheDocument();
        expect(infoTekst).toBeInTheDocument();
    });

    test('Kan legge til, fjerne og så legge et barn til igjen', async () => {
        jest.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });

        const søknad = {
            barnRegistrertManuelt: [manueltRegistrert],
            barnInkludertISøknaden: [manueltRegistrert, fraPdlSomIBarnMedISøknad],
            søker: { barn: [fraPdl] },
            dokumentasjon: [],
        };
        const { settSøknad, axiosRequestMock } = spyOnUseApp(søknad);
        axiosRequestMock.mockReturnValue(byggSuksessRessurs(false));

        settSøknad.mockImplementation((nySøknad: ISøknad) => {
            søknad.barnRegistrertManuelt = nySøknad.barnRegistrertManuelt;
            søknad.barnInkludertISøknaden = nySøknad.barnInkludertISøknaden;
        });

        const { getByText, getByLabelText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );

        const fjernBarnKnapp = getByText(/hvilkebarn.fjern-barn.knapp/);
        act(() => fjernBarnKnapp.click());

        const leggTilBarnKnapp = getByText(/hvilkebarn.leggtilbarn.kort.knapp/);
        act(() => leggTilBarnKnapp.click());

        const modal = getByLabelText('hvilkebarn.leggtilbarn.modal.tittel');
        const leggTilKnappIModal = modal.querySelector('button');

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
            fireEvent.input(fornavnInput, { target: { value: manueltRegistrert.navn } });
            fireEvent.input(etternavnInput, { target: { value: 'whatever' } });
            fireEvent.input(idnrInput, { target: { value: manueltRegistrert.ident } });
        });

        await act(() => leggTilKnappIModal?.click());

        expect(søknad.barnRegistrertManuelt.length).toBe(1);
        // Først fjernet vi barnet, så la vi det til igjen
        expect(settSøknad).toHaveBeenCalledTimes(2);
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

        const { getByLabelText } = render(
            <TestProvidere>
                <VelgBarn />
            </TestProvidere>
        );
        const checkbox: HTMLInputElement = getByLabelText(
            /hvilkebarn.barn.søk-om.spm/
        ) as HTMLInputElement;
        act(() => checkbox.click());

        expect(checkbox.checked).toBe(true);
    });
});
