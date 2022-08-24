import React from 'react';

import { render } from '@testing-library/react';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';

import { ISøker } from '../../../typer/person';
import {
    mockEøs,
    mockHistory,
    silenceConsoleErrors,
    spyOnUseApp,
    TestProvidere,
    TestProvidereMedEkteTekster,
} from '../../../utils/testing';
import OmDeg from './OmDeg';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';

const TestKomponent = () => (
    <TestProvidere>
        <OmDeg />
    </TestProvidere>
);

const TestKomponentMedEkteTekster = () => (
    <TestProvidereMedEkteTekster>
        <OmDeg />
    </TestProvidereMedEkteTekster>
);

describe('OmDeg', () => {
    beforeEach(() => {
        silenceConsoleErrors();
        mockEøs();
        mockHistory(['/om-deg']);
    });

    test('Alle tekster finnes når man svarer at man ikke bor på registrert adresse', () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                borPåRegistrertAdresse: {
                    id: OmDegSpørsmålId.borPåRegistrertAdresse,
                    svar: ESvar.NEI,
                },
                yrkesaktivFemÅr: {
                    id: OmDegSpørsmålId.yrkesaktivFemÅr,
                    svar: ESvar.JA,
                },
            }),
        });

        render(<TestKomponentMedEkteTekster />);
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('Skal rendre 2 alertstriper i OmDeg', async () => {
        spyOnUseApp({ søker: mockDeep<ISøker>({ statsborgerskap: [] }) });
        const { container } = render(<TestKomponentMedEkteTekster />);
        expect(container.getElementsByClassName('navds-alert')).toHaveLength(2);
    });

    test('Viser adressesperre-melding', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { findByText } = render(<TestKomponent />);

        expect(
            await findByText(/omdeg.personopplysninger.adressesperre.alert/)
        ).toBeInTheDocument();
    });

    test('Kan gå videre i søknad ved adresse som er ukjent, får ikke spm om bosted, men opphold i norge', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adresse: undefined,
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText, container } = render(<TestKomponent />);
        // Lar async useEffect i AppContext bli ferdig
        await container.getElementsByClassName('navds-alert');
        expect(
            queryByText(omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse])
        ).not.toBeInTheDocument();
        expect(
            queryByText(omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder])
        ).toBeInTheDocument();
    });

    test('Søker med adresse får opp to spørsmål med en gang', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: false,
                statsborgerskap: [{ landkode: 'NOR' }],
                borPåRegistrertAdresse: { id: OmDegSpørsmålId.borPåRegistrertAdresse, svar: null },
                værtINorgeITolvMåneder: { id: OmDegSpørsmålId.værtINorgeITolvMåneder, svar: null },
                yrkesaktivFemÅr: { id: OmDegSpørsmålId.yrkesaktivFemÅr, svar: null },
            }),
        });
        const { queryByText } = render(<TestKomponent />);

        expect(queryByText(omDegSpørsmålSpråkId['bor-på-registrert-adresse'])).toBeInTheDocument();
        expect(
            queryByText(omDegSpørsmålSpråkId['søker-vært-i-norge-sammenhengende-tolv-måneder'])
        ).toBeInTheDocument();
    });

    test('Søker med adressesperre får ikke opp spørsmål om bosted', async () => {
        spyOnUseApp({
            søker: mockDeep<ISøker>({
                adressebeskyttelse: true,
                statsborgerskap: [{ landkode: 'NOR' }],
            }),
        });
        const { queryByText, container } = render(<TestKomponent />);
        // Lar async useEffect i AppContext bli ferdig
        await container.getElementsByClassName('navds-alert');

        expect(
            queryByText(omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse])
        ).not.toBeInTheDocument();

        expect(
            queryByText(omDegSpørsmålSpråkId['søker-vært-i-norge-sammenhengende-tolv-måneder'])
        ).toBeInTheDocument();
    });
});
