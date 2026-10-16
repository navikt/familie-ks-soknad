import { BASE_PATH } from '../../src/common/miljø';
import { modellVersjon } from '../../src/common/modellversjon';
import { expect, test } from '../fixtures';
import { forventSteg, gåTilSteg, Steg } from '../søknad';

// Indeksen til «Livssituasjonen din» i stegrekkefølgen, der forsiden har indeks 0.
const DIN_LIVSSITUASJON_STEGINDEKS = 2;

test.describe('Mellomlagring', () => {
    test.beforeEach(async ({ page, mellomlager }) => {
        await gåTilSteg(page, Steg.VelgBarn);
        await expect.poll(() => mellomlager.lagret()?.sisteUtfylteStegIndex).toBe(DIN_LIVSSITUASJON_STEGINDEKS);
    });

    test('skal tilby å fortsette på søknaden når søkeren velger «Fortsett senere»', async ({ page }) => {
        await page.getByRole('button', { name: 'Fortsett senere' }).click();

        await expect(page).toHaveURL(BASE_PATH);
        await expect(page.getByText(/^Du har en påbegynt søknad/)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Fortsett på søknaden' })).toBeVisible();
    });

    test('skal gjenopprette søknaden etter at siden er lastet på nytt', async ({ page }) => {
        await page.reload();

        await page.getByRole('button', { name: 'Fortsett på søknaden' }).click();

        await forventSteg(page, Steg.VelgBarn);
        await page.getByRole('button', { name: 'Forrige steg' }).click();
        await forventSteg(page, Steg.DinLivssituasjon);
        await expect(
            page.getByRole('radiogroup', { name: 'Er du asylsøker?' }).getByRole('radio', { name: 'Nei' })
        ).toBeChecked();
    });

    test('skal slette den mellomlagrede søknaden når søkeren starter på nytt', async ({ page, mellomlager }) => {
        await page.reload();

        await page.getByRole('button', { name: 'Start på nytt' }).click();
        await page
            .getByRole('dialog', { name: 'Dette sletter søknaden' })
            .getByRole('button', { name: 'Slett søknaden' })
            .click();

        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Fortsett på søknaden' })).toBeHidden();
        await expect.poll(() => mellomlager.lagret()).toBeUndefined();
    });

    test('skal slette søknaden når søkeren velger «Slett søknaden» underveis', async ({ page, mellomlager }) => {
        await page.getByRole('button', { name: 'Slett søknaden' }).click();
        await page
            .getByRole('dialog', { name: 'Dette sletter søknaden' })
            .getByRole('button', { name: 'Slett søknaden' })
            .click();

        await expect(page).toHaveURL(BASE_PATH);
        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
        await expect.poll(() => mellomlager.lagret()).toBeUndefined();
    });

    test('skal ikke tilby å fortsette på en søknad som er lagret med en eldre modellversjon', async ({
        page,
        mellomlager,
    }) => {
        mellomlager.endre({ modellVersjon: modellVersjon - 1 });

        await page.reload();

        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Fortsett på søknaden' })).toBeHidden();
    });
});
