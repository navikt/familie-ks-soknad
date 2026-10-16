import { expect, test } from '../fixtures';
import {
    ANDRE_FORELDER,
    BARN,
    forventSteg,
    fyllUtOmDeg,
    gåTilNesteSteg,
    gåTilSteg,
    oppsummeringsbolk,
    Steg,
    SØKER,
    svar,
} from '../søknad';

test.describe('Navigering mellom steg', () => {
    test('skal vise hva som mangler og stoppe søkeren når spørsmål ikke er besvart', async ({ page }) => {
        await gåTilSteg(page, Steg.OmDeg);

        await gåTilNesteSteg(page);

        await expect(
            page.getByRole('heading', { name: 'Du må rette opp eller svare på følgende spørsmål for å gå videre' })
        ).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'Du må oppgi om du bor på denne adressen for å gå videre' })
        ).toBeVisible();
        await forventSteg(page, Steg.OmDeg);
    });

    test('skal beholde svarene når søkeren går tilbake til forrige steg', async ({ page }) => {
        await gåTilSteg(page, Steg.OmDeg);
        await fyllUtOmDeg(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.DinLivssituasjon);

        await page.getByRole('button', { name: 'Forrige steg' }).click();

        await forventSteg(page, Steg.OmDeg);
        await expect(
            page.getByRole('radiogroup', { name: 'Bor du på denne adressen?' }).getByRole('radio', { name: 'Ja' })
        ).toBeChecked();
    });
});

test.describe('Oppsummering', () => {
    test('skal vise svarene fra hvert steg', async ({ page }) => {
        await gåTilSteg(page, Steg.Oppsummering);

        await expect(oppsummeringsbolk(page, '1. Om deg').getByText(SØKER.ident)).toBeVisible();
        await expect(oppsummeringsbolk(page, '3. Hvilke barn søker du for?').getByText(BARN.navn)).toBeVisible();
        await expect(oppsummeringsbolk(page, `5. Om ${BARN.navn}`).getByText(ANDRE_FORELDER.navn)).toBeVisible();
    });

    test('skal vise endrede svar etter at søkeren har gått tilbake via «Endre svar»', async ({ page }) => {
        await gåTilSteg(page, Steg.Oppsummering);
        const omDeg = oppsummeringsbolk(page, '1. Om deg');
        await expect(omDeg.getByText('Nei', { exact: true })).toBeHidden();

        await omDeg.getByRole('link', { name: 'Endre svar' }).click();
        await forventSteg(page, Steg.OmDeg);
        await svar(page, 'Bor du på denne adressen?', 'Nei');
        for (const steg of [Steg.DinLivssituasjon, Steg.VelgBarn, Steg.OmBarna, Steg.OmBarnet, Steg.Oppsummering]) {
            await gåTilNesteSteg(page);
            await forventSteg(page, steg);
        }

        await expect(oppsummeringsbolk(page, '1. Om deg').getByText('Nei', { exact: true })).toBeVisible();
    });
});
