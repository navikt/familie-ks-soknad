import { expect, test } from '../fixtures';
import { forventSteg, gåTilNesteSteg, gåTilSteg, Steg } from '../søknad';

// Syntetisk fødselsnummer (Tenor) som ikke tilhører en ekte person.
const NYTT_BARN = { fornavn: 'Lille', etternavn: 'Barnessen', ident: '10832350120' };

test.describe('Velg barn', () => {
    test('skal kreve at søkeren velger minst ett barn', async ({ page }) => {
        await gåTilSteg(page, Steg.VelgBarn);

        await gåTilNesteSteg(page);

        await expect(page.getByRole('link', { name: 'Du må velge et barn for å gå videre.' })).toBeVisible();
        await forventSteg(page, Steg.VelgBarn);
    });

    test('skal kreve navn og fødselsnummer når søkeren legger til et barn', async ({ page }) => {
        await gåTilSteg(page, Steg.VelgBarn);
        await page.getByRole('button', { name: 'Legg til barn' }).click();
        const dialog = page.getByRole('dialog', { name: 'Legg til barn' });

        await dialog.getByRole('button', { name: 'Legg til barn' }).click();

        const feiloppsummering = dialog.getByRole('list');
        await expect(
            feiloppsummering.getByRole('link', { name: 'Du må oppgi barnets fornavn for å gå videre' })
        ).toBeVisible();
        await expect(
            feiloppsummering.getByRole('link', { name: 'Du må oppgi barnets etternavn for å gå videre' })
        ).toBeVisible();
        await expect(
            feiloppsummering.getByRole('link', { name: /^Du må oppgi barnet sitt fødselsnummer/ })
        ).toBeVisible();
    });

    test('skal kunne legge til et barn som ikke står i folkeregisteret som søkerens barn', async ({ page }) => {
        await gåTilSteg(page, Steg.VelgBarn);
        await page.getByRole('button', { name: 'Legg til barn' }).click();
        const dialog = page.getByRole('dialog', { name: 'Legg til barn' });
        await dialog.getByRole('textbox', { name: 'Fornavn' }).fill(NYTT_BARN.fornavn);
        await dialog.getByRole('textbox', { name: 'Etternavn' }).fill(NYTT_BARN.etternavn);
        await dialog.getByRole('textbox', { name: 'Fødselsnummer eller d-nummer' }).fill(NYTT_BARN.ident);

        await dialog.getByRole('button', { name: 'Legg til barn' }).click();

        await expect(dialog).toBeHidden();
        await page
            .getByRole('checkbox', {
                name: `Søk om kontantstøtte for barnet ${NYTT_BARN.fornavn} ${NYTT_BARN.etternavn}`,
            })
            .check();
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.OmBarna);
    });

    test('skal henvise til papirsøknad når barnet ikke har fått fødselsnummer ennå', async ({ page }) => {
        await gåTilSteg(page, Steg.VelgBarn);
        await page.getByRole('button', { name: 'Legg til barn' }).click();
        const dialog = page.getByRole('dialog', { name: 'Legg til barn' });

        await dialog.getByRole('checkbox', { name: 'Barnet har ikke fått fødselsnummer ennå' }).check();

        await expect(dialog.getByRole('textbox', { name: 'Fødselsnummer eller d-nummer' })).toBeDisabled();
        await expect(
            dialog.getByText(/Du kan ikke bruke den digitale søknaden hvis barnet ikke har fødselsnummer/)
        ).toBeVisible();
        await expect(dialog.getByRole('link', { name: 'Gå til PDF/papirskjema' })).toBeVisible();
    });
});
