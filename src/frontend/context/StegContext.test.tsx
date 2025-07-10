import React from 'react';

import { renderHook } from '@testing-library/react';

import { RouteEnum } from '../typer/routes';
import { genererInitialBarnMedISøknad } from '../utils/barn';
import { spyOnUseApp, TestProvidere } from '../utils/testing';

import { StegProvider, useStegContext } from './StegContext';

describe('Steg', () => {
    const generertBarn = genererInitialBarnMedISøknad({
        id: '123',
        ident: '123',
        navn: 'Jens',
        borMedSøker: true,
        alder: '1',
        adressebeskyttelse: false,
        erUnder11Mnd: false,
    });

    beforeEach(() => {});
    test(`Kan hente steg før barn er valgt`, () => {
        spyOnUseApp({
            barnInkludertISøknaden: [],
        });

        const wrapper = ({ children }) => (
            <TestProvidere>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );
        const { result } = renderHook(() => useStegContext(), { wrapper });
        expect(result.current.steg.length).toEqual(9);
    });

    test(`Kan hente neste steg fra forsiden`, () => {
        const barn = { ...generertBarn };
        spyOnUseApp({
            barnInkludertISøknaden: [barn],
        });

        const wrapper = ({ children }) => (
            <TestProvidere>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );
        const { result } = renderHook(() => useStegContext(), { wrapper });
        const nesteSteg = result.current.hentNesteSteg();
        expect(nesteSteg.route).toBe(RouteEnum.OmDeg);
    });

    test(`Kan hente neste steg når inneværende route er eneste barn`, () => {
        const barn = { ...generertBarn };
        spyOnUseApp({
            barnInkludertISøknaden: [barn],
        });

        const wrapper = ({ children }) => (
            <TestProvidere mocketNettleserHistorikk={['/om-barnet/barn/1']}>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );
        const { result } = renderHook(() => useStegContext(), { wrapper });
        const nesteRoute = result.current.hentNesteSteg();
        expect(nesteRoute.route).toBe(RouteEnum.Oppsummering);
    });

    test(`Kan hente forrige steg når inneværende steg er eneste barn`, () => {
        const barn = { ...generertBarn };
        spyOnUseApp({
            barnInkludertISøknaden: [barn],
        });

        const wrapper = ({ children }) => (
            <TestProvidere mocketNettleserHistorikk={['/om-barnet/barn/1']}>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );
        const { result } = renderHook(() => useStegContext(), { wrapper });
        const nesteRoute = result.current.hentNesteSteg();
        expect(nesteRoute.route).toBe(RouteEnum.Oppsummering);
    });

    test(`Label til steg om barnet skal inneholde barnets navn`, () => {
        const barn = { ...generertBarn };
        spyOnUseApp({
            barnInkludertISøknaden: [barn],
        });

        const wrapper = ({ children }) => (
            <TestProvidere>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );
        const { result } = renderHook(() => useStegContext(), { wrapper });

        const route = result.current.steg[5];
        const label = route.label;
        expect(label).toEqual('Om barnet');
    });

    test(`Kan navigere til om-barna og barn-2 dersom det er to barn`, () => {
        const barn1 = { ...generertBarn };
        const barn2 = { ...generertBarn, navn: 'Line' };
        spyOnUseApp({
            barnInkludertISøknaden: [barn1, barn2],
        });
        const wrapper = ({ children }) => (
            <TestProvidere mocketNettleserHistorikk={['/om-barnet/barn/1']}>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );

        const { result } = renderHook(() => useStegContext(), { wrapper });

        expect(result.current.hentForrigeSteg().path).toBe('/om-barna');
        expect(result.current.hentNesteSteg().path).toBe('/om-barnet/barn/2');
    });

    test(`Kan navigere mellom tilbake til barn-1 eller til oppsummering dersom det er to barn`, () => {
        const barn1 = { ...generertBarn };
        const barn2 = { ...generertBarn, navn: 'Line' };
        spyOnUseApp({
            barnInkludertISøknaden: [barn1, barn2],
        });
        const wrapper = ({ children }) => (
            <TestProvidere mocketNettleserHistorikk={['/om-barnet/barn/2']}>
                <StegProvider>{children}</StegProvider>
            </TestProvidere>
        );

        const { result } = renderHook(() => useStegContext(), { wrapper });
        expect(result.current.hentForrigeSteg().path).toBe('/om-barnet/barn/1');
        expect(result.current.hentNesteSteg().path).toBe('/oppsummering');
    });
});
