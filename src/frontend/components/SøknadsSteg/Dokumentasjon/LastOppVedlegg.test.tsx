import React from 'react';

import { render } from '@testing-library/react';

import { IDokumentasjon } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { mockEøs, spyOnModal, spyOnUseApp, TestProvidere } from '../../../utils/testing';
import LastOppVedlegg from './LastOppVedlegg';

const hentAnnenDokumentasjon = (): IDokumentasjon => {
    jest.resetModules();
    const { initialStateSøknad } = jest.requireActual('../../../typer/søknad');

    const dokumentasjon = initialStateSøknad.dokumentasjon.find(
        dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    if (dokumentasjon === undefined) {
        throw new Error('Fant ikke dokumentasjonsbehov ANNEN_DOKUMENTASJON');
    }
    return dokumentasjon;
};

describe('LastOppVedlegg', () => {
    beforeEach(() => {
        jest.resetModules();
        mockEøs();
        spyOnModal();
    });

    it('Viser ikke info-tekst og checkbox knapp for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();
        const oppdaterDokumentasjon = jest.fn();

        const { queryByTestId, getByTestId } = render(
            <TestProvidere>
                <LastOppVedlegg
                    dokumentasjon={dokumentasjon}
                    vedleggNr={1}
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                />
            </TestProvidere>
        );

        expect(queryByTestId('dokumentasjon-er-sendt-inn-checkboks')).not.toBeInTheDocument();
        expect(queryByTestId('dokumentasjonsbeskrivelse')).not.toBeInTheDocument();
        expect(getByTestId('dokumentopplaster')).toBeInTheDocument();
    });
});
