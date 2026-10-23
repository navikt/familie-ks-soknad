import { HttpResponse, http } from 'msw';

import { Dokumentasjonsbehov } from '../../src/common/typer/kontrakt/dokumentasjon';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/søknadKontrakt';
import { expect, test } from '../fixtures';
import { erInnsending, gåTilSteg, lastOppFil, PDF, Steg, VEDLEGG_URL } from '../søknad';

test.describe('Dokumentasjon', () => {
    test('skal sende med opplastede vedlegg i søknaden', async ({ page }) => {
        await gåTilSteg(page, Steg.Dokumentasjon);

        await lastOppFil(page, PDF);
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeVisible();
        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();

        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        const annenDokumentasjon = søknad.dokumentasjon.find(
            dokumentasjon => dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
        );
        expect(annenDokumentasjon?.opplastedeVedlegg).toEqual([expect.objectContaining({ navn: PDF.name })]);
    });

    test('skal kunne slette et opplastet vedlegg', async ({ page }) => {
        await gåTilSteg(page, Steg.Dokumentasjon);
        await lastOppFil(page, PDF);
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeVisible();

        await page.getByRole('button', { name: 'Slett filen' }).click();

        await expect(page.getByRole('heading', { name: /^Vedlegg/ })).toBeHidden();
        await expect(page.getByText(PDF.name)).toBeHidden();
    });

    test('skal avvise filtyper som ikke støttes', async ({ page }) => {
        await gåTilSteg(page, Steg.Dokumentasjon);

        await lastOppFil(page, { name: 'notat.txt', mimeType: 'text/plain', buffer: Buffer.from('notat') });

        await expect(page.getByRole('heading', { name: 'Vedlegg med feil (1)' })).toBeVisible();
        await expect(page.getByText('Filformatet støttes ikke')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeHidden();
    });

    test('skal vise feilmelding når opplastingen feiler', async ({ page, apiMock }) => {
        apiMock.use(http.post(VEDLEGG_URL, () => new HttpResponse(null, { status: 500 })));
        await gåTilSteg(page, Steg.Dokumentasjon);

        await lastOppFil(page, PDF);

        await expect(page.getByRole('heading', { name: 'Vedlegg med feil (1)' })).toBeVisible();
        await expect(page.getByText('Filopplastingen mislyktes på grunn av en ukjent feil. Prøv igjen.')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Vedlegg (1)' })).toBeHidden();
    });
});
