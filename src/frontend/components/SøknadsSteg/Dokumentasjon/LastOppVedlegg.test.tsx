import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import type { IDokumentasjon } from '../../../typer/dokumentasjon';
import { initialStateSøknad } from '../../../typer/søknad';
import { spyOnUseApp, TestProvidere } from '../../../utils/testing';

import LastOppVedlegg from './LastOppVedlegg';

const hentAnnenDokumentasjon = (): IDokumentasjon => {
    const dokumentasjon = initialStateSøknad.dokumentasjon.find(
        dok => dok.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    if (dokumentasjon === undefined) {
        throw new Error('Fant ikke dokumentasjonsbehov ANNEN_DOKUMENTASJON');
    }
    return dokumentasjon;
};

const sendtInnTidligere = /^DOKUMENTASJON\.sendtInnTidligere/;

describe('LastOppVedlegg', () => {
    it('Viser beskrivelse, men ikke checkbox, for ANNEN_DOKUMENTASJON', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();
        const oppdaterDokumentasjon = vi.fn();

        render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={oppdaterDokumentasjon} />
            </TestProvidere>
        );

        expect(screen.queryByRole('checkbox', { name: sendtInnTidligere })).not.toBeInTheDocument();
        expect(screen.getByText('DOKUMENTASJON.annenDokumentasjonBeskrivelse')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'DOKUMENTASJON.velgFiler' })).toBeInTheDocument();
    });
});
