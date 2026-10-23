import { isPortableTextSpan } from '@portabletext/toolkit';
import { render, screen } from '@testing-library/react';
import { mockDeep } from 'vitest-mock-extended';

import { type LocaleRecordBlock, LocaleType } from '../../common/typer/locale';

import OmDeg from '../components/SøknadsSteg/OmDeg/OmDeg';
import type { ISøker } from '../typer/person';
import {
    hentSpørsmål,
    hentSvaralternativ,
    lagTekstProxy,
    spyOnUseApp,
    spørsmålFinnes,
    TestProvidere,
    ventPåSpørsmål,
} from './testing';

const blokkTekst = (block: LocaleRecordBlock, locale: LocaleType = LocaleType.nb) => {
    const barn = block[locale][0].children[0];
    return isPortableTextSpan(barn) ? barn.text : undefined;
};

describe('lagTekstProxy', () => {
    it('gir hver tekst en blokk lik nøkkelstien på alle språk', () => {
        const { OM_DEG } = lagTekstProxy();

        expect(blokkTekst(OM_DEG.borPaaAdressen.sporsmal)).toBe('OM_DEG.borPaaAdressen.sporsmal');
        expect(blokkTekst(OM_DEG.borPaaAdressen.sporsmal, LocaleType.nn)).toBe('OM_DEG.borPaaAdressen.sporsmal');
        expect(blokkTekst(OM_DEG.borPaaAdressen.sporsmal, LocaleType.en)).toBe('OM_DEG.borPaaAdressen.sporsmal');
        expect(blokkTekst(OM_DEG.oppholdtDegSammenhengende.sporsmal)).toBe('OM_DEG.oppholdtDegSammenhengende.sporsmal');
    });

    it('gir api_navn lik nøkkelstien', () => {
        expect(lagTekstProxy().OM_DEG.borPaaAdressen.api_navn).toBe('OM_DEG.borPaaAdressen');
    });

    it('gir de samme objektene ved hvert oppslag', () => {
        const tekster = lagTekstProxy();

        expect(tekster.OM_DEG).toBe(tekster.OM_DEG);
    });

    it('tolkes ikke som et promise', async () => {
        const tekster = lagTekstProxy();

        expect((tekster as unknown as { then: unknown }).then).toBeUndefined();
        expect(await Promise.resolve(tekster.OM_DEG)).toBe(tekster.OM_DEG);
    });

    it('bruker overstyringer for gitte nøkkelstier', () => {
        const overstyring = { nb: 'egen tekst' };
        const tekster = lagTekstProxy({ 'OM_DEG.navn': overstyring });

        expect(tekster.OM_DEG.navn).toBe(overstyring);
    });
});

describe('spyOnUseApp', () => {
    it('gir plainTekst som returnerer nøkkelstien', () => {
        const { useAppMock } = spyOnUseApp({});
        const { tekster, plainTekst } = useAppMock();

        expect(plainTekst(tekster().OM_DEG.omDegTittel)).toBe('OM_DEG.omDegTittel');
    });
});

const renderOmDeg = (søker: Partial<ISøker>) => {
    spyOnUseApp({ søker: mockDeep<ISøker>({ statsborgerskap: [{ landkode: 'NOR' }], ...søker }) });
    render(
        <TestProvidere>
            <OmDeg />
        </TestProvidere>
    );
};

describe('Hjelpere for spørringer på Ja/Nei-spørsmål', () => {
    it('finner spørsmål ut fra nøkkelstien og svaralternativene innenfor det', async () => {
        renderOmDeg({ adressebeskyttelse: false });

        const spørsmål = await ventPåSpørsmål('OM_DEG.borPaaAdressen.sporsmal');

        expect(hentSvaralternativ(spørsmål, 'ja')).toBeInTheDocument();
        expect(hentSvaralternativ(spørsmål, 'nei')).toBeInTheDocument();
        expect(hentSpørsmål('OM_DEG.borPaaAdressen.sporsmal')).toBe(spørsmål);
    });

    it('skiller spørsmål som vises samtidig', async () => {
        renderOmDeg({ adressebeskyttelse: false });

        const bosted = await ventPåSpørsmål('OM_DEG.borPaaAdressen.sporsmal');
        const opphold = await ventPåSpørsmål('OM_DEG.oppholdtDegSammenhengende.sporsmal');

        expect(bosted).not.toBe(opphold);
        expect(screen.getAllByRole('radio', { name: 'FELLES.frittståendeOrd.ja' }).length).toBeGreaterThanOrEqual(2);
    });

    it('spørsmålFinnes gir false for spørsmål som ikke vises', async () => {
        renderOmDeg({ adresse: undefined, adressebeskyttelse: false });

        await ventPåSpørsmål('OM_DEG.oppholdtDegSammenhengende.sporsmal');

        expect(spørsmålFinnes('OM_DEG.borPaaAdressen.sporsmal')).toBe(false);
    });
});
