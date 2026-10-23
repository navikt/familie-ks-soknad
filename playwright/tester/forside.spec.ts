import { BASE_PATH } from '../../src/common/miljø';
import { expect, test } from '../fixtures';
import { forventSteg, Steg, SØKER, startSøknad } from '../søknad';

test.describe('Forside', () => {
    test('skal vise forsiden med navnet til søkeren', async ({ page }) => {
        await page.goto(BASE_PATH);

        await expect(page.getByRole('heading', { level: 1, name: 'Søknad om kontantstøtte' })).toBeVisible();
        await expect(page.getByRole('heading', { name: `Hei, ${SØKER.navn}!` })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
    });

    test('skal kreve bekreftelse før søknaden kan startes', async ({ page }) => {
        await page.goto(BASE_PATH);

        await page.getByRole('button', { name: 'Start søknad' }).click();

        await expect(
            page.getByText('Du må bekrefte at du vil svare så godt du kan på spørsmålene før du kan starte søknaden.')
        ).toBeVisible();
        await expect(page).toHaveURL(BASE_PATH);
    });

    test('skal gå til «Om deg» når søknaden startes', async ({ page }) => {
        await startSøknad(page);

        await expect(page).toHaveURL(`${BASE_PATH}om-deg`);
        await forventSteg(page, Steg.OmDeg);
    });
});
