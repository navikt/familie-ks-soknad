import { isPortableTextSpan } from '@portabletext/toolkit';

import { type LocaleRecordBlock, LocaleType } from '../../common/typer/locale';

import { lagTekstProxy } from './testing';

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
