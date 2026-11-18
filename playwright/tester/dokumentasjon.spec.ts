import type { Page, Request } from '@playwright/test';
import { HttpResponse, http } from 'msw';

import { BASE_PATH } from '../../src/common/miljø';
import { Dokumentasjonsbehov } from '../../src/common/typer/kontrakt/dokumentasjon';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/søknadKontrakt';
import type { IDokumentasjon, IVedlegg } from '../../src/frontend/typer/dokumentasjon';
import { expect, test } from '../fixtures';
import type { Mellomlager } from '../mellomlager';
import {
    erInnsending,
    fyllUtOmBarnet,
    gåTilNesteSteg,
    gåTilSteg,
    lastOppFil,
    MELLOMLAGRING_URL,
    PDF,
    Steg,
    svar,
    VEDLEGG_URL,
} from '../søknad';

const ANNEN = Dokumentasjonsbehov.ANNEN_DOKUMENTASJON;
const AVTALE_DELT_BOSTED = Dokumentasjonsbehov.AVTALE_DELT_BOSTED;
const FØRTISEKS_TIMER_MS = 46 * 60 * 60 * 1000;
const OPPSUMMERING_STEGINDEKS = 6;

function erMellomlagring(request: Request) {
    return request.method() === 'POST' && new URL(request.url()).pathname === MELLOMLAGRING_URL;
}

function hentDokumentasjon(mellomlager: Mellomlager, behov: Dokumentasjonsbehov): IDokumentasjon {
    const dokumentasjon = mellomlager.lagret()?.søknad.dokumentasjon.find(dok => dok.dokumentasjonsbehov === behov);
    if (!dokumentasjon) {
        throw new Error(`Fant ikke dokumentasjon for ${behov} i mellomlageret`);
    }
    return dokumentasjon;
}

function leggVedTestfiler(
    mellomlager: Mellomlager,
    seeds: { behov: Dokumentasjonsbehov; vedlegg: IVedlegg[]; harSendtInn?: boolean }[]
) {
    const lagret = mellomlager.lagret();
    if (!lagret) {
        throw new Error('Kan ikke legge testvedlegg til en søknad som ikke er mellomlagret');
    }

    mellomlager.endre({
        søknad: {
            ...lagret.søknad,
            dokumentasjon: lagret.søknad.dokumentasjon.map(dokumentasjon => {
                const seed = seeds.find(({ behov }) => behov === dokumentasjon.dokumentasjonsbehov);
                return seed
                    ? {
                          ...dokumentasjon,
                          harSendtInn: seed.harSendtInn ?? dokumentasjon.harSendtInn,
                          opplastedeVedlegg: seed.vedlegg,
                      }
                    : dokumentasjon;
            }),
        },
    });
}

function lagTestvedlegg(dokumentId: string, navn: string, tidspunkt = new Date().toISOString()): IVedlegg {
    return { dokumentId, navn, størrelse: 128, tidspunkt };
}

async function gåTilDokumentasjon(page: Page, mellomlager: Mellomlager, medEtterspurtDokumentasjon = false) {
    if (medEtterspurtDokumentasjon) {
        await gåTilSteg(page, Steg.OmBarnet);
        await fyllUtOmBarnet(page);
        await svar(page, /^Bor du sammen med den andre forelderen/, 'Nei');
        await svar(page, /^Søker du om delt kontantstøtte/, 'Ja');
        await gåTilNesteSteg(page);
        await expect(page.getByRole('heading', { level: 2, name: Steg.Oppsummering, exact: true })).toBeVisible();
    } else {
        await gåTilSteg(page, Steg.Oppsummering);
    }

    const lagringsrespons = page.waitForResponse(respons => erMellomlagring(respons.request()));
    await gåTilNesteSteg(page);
    await expect(page.getByRole('heading', { level: 2, name: Steg.Dokumentasjon, exact: true })).toBeVisible();
    expect((await lagringsrespons).ok()).toBe(true);
    await expect.poll(() => mellomlager.lagret()?.sisteUtfylteStegIndex).toBe(OPPSUMMERING_STEGINDEKS);
    await expect.poll(() => mellomlager.lagret()?.sistePåbegynteStegIndex).toBe(OPPSUMMERING_STEGINDEKS);
}

async function gjenopptaDokumentasjon(page: Page) {
    await page.goto(BASE_PATH);
    await page.getByRole('button', { name: 'Fortsett på søknaden' }).click();
    await expect(page.getByRole('heading', { level: 2, name: Steg.Oppsummering, exact: true })).toBeVisible();
    await gåTilNesteSteg(page);
    await expect(page.getByRole('heading', { level: 2, name: Steg.Dokumentasjon, exact: true })).toBeVisible();
}

function hentKontraktdokumentasjon(søknad: ISøknadKontrakt, behov: Dokumentasjonsbehov) {
    const dokumentasjon = søknad.dokumentasjon.find(dok => dok.dokumentasjonsbehov === behov);
    if (!dokumentasjon) {
        throw new Error(`Fant ikke dokumentasjon for ${behov} i innsendingen`);
    }
    return dokumentasjon;
}

test.describe('Dokumentasjon', () => {
    test('ny søknad uten dokumentasjonskrav har ingen frivillig opplasting, men kan sendes inn', async ({
        page,
        mellomlager,
    }) => {
        await gåTilDokumentasjon(page, mellomlager);

        await expect(page.getByRole('heading', { name: 'Annen dokumentasjon', exact: true })).toBeHidden();
        await expect(page.locator('input[type="file"]')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Slik tar du et godt bilde av et dokument' })).toBeHidden();

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();

        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(hentKontraktdokumentasjon(søknad, ANNEN).opplastedeVedlegg).toEqual([]);
    });

    test('skal laste opp, sende inn og slette vedlegg for et faktisk dokumentasjonskrav', async ({
        page,
        mellomlager,
    }) => {
        await gåTilDokumentasjon(page, mellomlager, true);

        await lastOppFil(page, PDF);
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeVisible();
        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();

        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(hentKontraktdokumentasjon(søknad, AVTALE_DELT_BOSTED).opplastedeVedlegg).toEqual([
            expect.objectContaining({ navn: PDF.name, tittel: AVTALE_DELT_BOSTED }),
        ]);
    });

    test('skal kunne slette et vedlegg som er etterspurt', async ({ page, mellomlager }) => {
        await gåTilDokumentasjon(page, mellomlager, true);
        await lastOppFil(page, PDF);
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeVisible();

        await page.getByRole('button', { name: 'Slett filen' }).click();

        await expect(page.getByRole('heading', { name: /^Vedlegg/ })).toBeHidden();
        await expect(page.getByText(PDF.name)).toBeHidden();
    });

    test('skal avvise filtyper som ikke støttes for etterspurt dokumentasjon', async ({ page, mellomlager }) => {
        await gåTilDokumentasjon(page, mellomlager, true);

        await lastOppFil(page, { name: 'notat.txt', mimeType: 'text/plain', buffer: Buffer.from('notat') });

        await expect(page.getByRole('heading', { name: 'Vedlegg med feil (1)' })).toBeVisible();
        await expect(page.getByText('Filformatet støttes ikke')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeHidden();
    });

    test('skal vise feilmelding når opplasting av etterspurt dokumentasjon feiler', async ({
        page,
        apiMock,
        mellomlager,
    }) => {
        apiMock.use(http.post(VEDLEGG_URL, () => new HttpResponse(null, { status: 500 })));
        await gåTilDokumentasjon(page, mellomlager, true);

        await lastOppFil(page, PDF);

        await expect(page.getByRole('heading', { name: 'Vedlegg med feil (1)' })).toBeVisible();
        await expect(page.getByText('Filopplastingen mislyktes på grunn av en ukjent feil. Prøv igjen.')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeHidden();
    });

    test('skal vise og sende med lagrede frivillige vedlegg også når de er sendt inn tidligere', async ({
        page,
        mellomlager,
    }) => {
        await gåTilDokumentasjon(page, mellomlager);
        const vedlegg = [
            lagTestvedlegg('syntetisk-annen-1', 'lagret-vedlegg-1.pdf'),
            lagTestvedlegg('syntetisk-annen-2', 'lagret-vedlegg-2.pdf'),
        ];
        leggVedTestfiler(mellomlager, [{ behov: ANNEN, vedlegg, harSendtInn: true }]);

        await gjenopptaDokumentasjon(page);

        await expect(page.getByText(vedlegg[0].navn)).toBeVisible();
        await expect(page.getByText(vedlegg[1].navn)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Velg filer' })).toHaveCount(0);
        expect(hentDokumentasjon(mellomlager, ANNEN).harSendtInn).toBe(true);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(hentKontraktdokumentasjon(søknad, ANNEN)).toMatchObject({
            harSendtInn: true,
            opplastedeVedlegg: vedlegg.map(({ dokumentId, navn }) =>
                expect.objectContaining({ dokumentId, navn, tittel: ANNEN })
            ),
        });
    });

    test('skal lagre sletting av siste frivillige vedlegg før gjenopptak og innsending', async ({
        page,
        mellomlager,
    }) => {
        await gåTilDokumentasjon(page, mellomlager);
        const slettetVedlegg = lagTestvedlegg('syntetisk-annen-slettes', 'skal-ikke-sendes.pdf');
        leggVedTestfiler(mellomlager, [{ behov: ANNEN, vedlegg: [slettetVedlegg] }]);

        await gjenopptaDokumentasjon(page);
        await expect(page.getByText(slettetVedlegg.navn)).toBeVisible();

        const lagringsrespons = page.waitForResponse(respons => erMellomlagring(respons.request()));
        await page.getByRole('button', { name: 'Slett filen' }).click();
        await expect(page.getByText(slettetVedlegg.navn)).toBeHidden();
        expect((await lagringsrespons).ok()).toBe(true);
        await expect.poll(() => hentDokumentasjon(mellomlager, ANNEN).opplastedeVedlegg).toEqual([]);

        await gjenopptaDokumentasjon(page);
        await expect(page.getByRole('heading', { name: 'Annen dokumentasjon', exact: true })).toBeHidden();
        await expect(page.locator('input[type="file"]')).toHaveCount(0);
        expect(hentDokumentasjon(mellomlager, ANNEN).opplastedeVedlegg).toEqual([]);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(hentKontraktdokumentasjon(søknad, ANNEN).opplastedeVedlegg).toEqual([]);
    });

    test('skal beholde lagrede frivillige vedlegg sammen med ny opplasting av etterspurt dokumentasjon', async ({
        page,
        mellomlager,
    }) => {
        await gåTilDokumentasjon(page, mellomlager, true);
        const lagretVedlegg = lagTestvedlegg('syntetisk-blanding-annen', 'lagret-annen.pdf');
        leggVedTestfiler(mellomlager, [{ behov: ANNEN, vedlegg: [lagretVedlegg], harSendtInn: true }]);

        await gjenopptaDokumentasjon(page);
        await expect(page.getByText(lagretVedlegg.navn)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Velg filer' })).toHaveCount(1);
        await lastOppFil(page, PDF);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(hentKontraktdokumentasjon(søknad, ANNEN)).toMatchObject({
            harSendtInn: true,
            opplastedeVedlegg: [
                expect.objectContaining({
                    dokumentId: lagretVedlegg.dokumentId,
                    navn: lagretVedlegg.navn,
                    tittel: ANNEN,
                }),
            ],
        });
        expect(hentKontraktdokumentasjon(søknad, AVTALE_DELT_BOSTED).opplastedeVedlegg).toEqual([
            expect.objectContaining({ navn: PDF.name, tittel: AVTALE_DELT_BOSTED }),
        ]);
    });

    test('skal fjerne vedlegg ved 46 timer ved montering og beholde ferske vedlegg', async ({ page, mellomlager }) => {
        await gåTilDokumentasjon(page, mellomlager, true);
        const nå = new Date('2026-01-15T12:00:00.000Z');
        const grense = nå.getTime() - FØRTISEKS_TIMER_MS;
        const vedleggVedGrensen = (kategori: string) => [
            lagTestvedlegg(`${kategori}-rett-før`, `${kategori}-rett-før.pdf`, new Date(grense + 1).toISOString()),
            lagTestvedlegg(`${kategori}-akkurat`, `${kategori}-akkurat.pdf`, new Date(grense).toISOString()),
            lagTestvedlegg(`${kategori}-rett-etter`, `${kategori}-rett-etter.pdf`, new Date(grense - 1).toISOString()),
        ];
        leggVedTestfiler(mellomlager, [
            { behov: ANNEN, vedlegg: vedleggVedGrensen('annen'), harSendtInn: true },
            { behov: AVTALE_DELT_BOSTED, vedlegg: vedleggVedGrensen('avtale') },
        ]);
        await page.clock.setFixedTime(nå);

        await gjenopptaDokumentasjon(page);
        await expect
            .poll(() => hentDokumentasjon(mellomlager, ANNEN).opplastedeVedlegg.map(vedlegg => vedlegg.dokumentId))
            .toEqual(['annen-rett-før']);
        await expect
            .poll(() =>
                hentDokumentasjon(mellomlager, AVTALE_DELT_BOSTED).opplastedeVedlegg.map(vedlegg => vedlegg.dokumentId)
            )
            .toEqual(['avtale-rett-før']);
        await expect(
            page.getByText(
                'Det har gått for lang tid siden du startet på søknaden, og dokumentasjonen du har lastet opp tidligere er ikke lenger lagret hos oss.',
                { exact: true }
            )
        ).toBeVisible();
        await expect(page.getByText('Du må laste opp følgende filer på nytt:', { exact: true })).toBeVisible();

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(hentKontraktdokumentasjon(søknad, ANNEN).opplastedeVedlegg).toEqual([
            expect.objectContaining({ dokumentId: 'annen-rett-før', navn: 'annen-rett-før.pdf', tittel: ANNEN }),
        ]);
        expect(hentKontraktdokumentasjon(søknad, AVTALE_DELT_BOSTED).opplastedeVedlegg).toEqual([
            expect.objectContaining({
                dokumentId: 'avtale-rett-før',
                navn: 'avtale-rett-før.pdf',
                tittel: AVTALE_DELT_BOSTED,
            }),
        ]);
    });
});
