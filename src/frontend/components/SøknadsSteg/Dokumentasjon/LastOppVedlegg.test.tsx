import { fireEvent, render, screen } from '@testing-library/react';
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
const eksisterendeVedlegg = {
    dokumentId: 'dokument-id',
    navn: 'vedlegg.pdf',
    størrelse: 123,
    tidspunkt: '2026-01-01T00:00:00.000Z',
};

describe('LastOppVedlegg', () => {
    it('viser ikke ANNEN_DOKUMENTASJON uten opplastede vedlegg', () => {
        spyOnUseApp({});
        const dokumentasjon = hentAnnenDokumentasjon();

        const { container } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it.each([false, true])('viser lagrede vedlegg uten ny opplasting når harSendtInn er %s', harSendtInn => {
        spyOnUseApp({});
        const dokumentasjon = {
            ...hentAnnenDokumentasjon(),
            harSendtInn,
            opplastedeVedlegg: [eksisterendeVedlegg],
        };

        const { container } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(screen.queryByRole('checkbox', { name: sendtInnTidligere })).not.toBeInTheDocument();
        expect(screen.queryByText('DOKUMENTASJON.annenDokumentasjonBeskrivelse')).not.toBeInTheDocument();
        expect(screen.getByText('DOKUMENTASJON.annenDokumentasjon')).toBeInTheDocument();
        expect(screen.getByText(eksisterendeVedlegg.navn)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'DOKUMENTASJON.slettFilen' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'DOKUMENTASJON.velgFiler' })).not.toBeInTheDocument();
        expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
    });

    it('fjerner seksjonen når siste eksisterende ANNEN_DOKUMENTASJON-vedlegg slettes', () => {
        spyOnUseApp({});
        const dokumentasjon = {
            ...hentAnnenDokumentasjon(),
            opplastedeVedlegg: [eksisterendeVedlegg],
        };
        const oppdaterDokumentasjon = vi.fn();

        const { rerender } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={oppdaterDokumentasjon} />
            </TestProvidere>
        );

        fireEvent.click(screen.getByRole('button', { name: 'DOKUMENTASJON.slettFilen' }));

        expect(oppdaterDokumentasjon).toHaveBeenCalledWith(
            Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            [],
            dokumentasjon.harSendtInn
        );

        rerender(
            <TestProvidere>
                <LastOppVedlegg
                    dokumentasjon={{ ...dokumentasjon, opplastedeVedlegg: [] }}
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                />
            </TestProvidere>
        );

        expect(screen.queryByText(eksisterendeVedlegg.navn)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'DOKUMENTASJON.velgFiler' })).not.toBeInTheDocument();
    });

    it('beholder opplasting og tidligere-innsendt-checkbox for etterspurt dokumentasjon', () => {
        spyOnUseApp({});
        const dokumentasjon = {
            ...hentAnnenDokumentasjon(),
            dokumentasjonsbehov: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            opplastedeVedlegg: [],
        };

        const { container } = render(
            <TestProvidere>
                <LastOppVedlegg dokumentasjon={dokumentasjon} oppdaterDokumentasjon={vi.fn()} />
            </TestProvidere>
        );

        expect(screen.getByRole('checkbox', { name: sendtInnTidligere })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'DOKUMENTASJON.velgFiler' })).toBeInTheDocument();
        expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });
});
