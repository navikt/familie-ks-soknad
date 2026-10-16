import type { Page } from '@playwright/test';

import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/søknadKontrakt';
import { expect, test } from '../fixtures';
import {
    BARN,
    erInnsending,
    forventSteg,
    fyllUtOmBarna,
    fyllUtOmBarnet,
    fyllUtVelgBarn,
    gåTilNesteSteg,
    gåTilSteg,
    Steg,
    svar,
} from '../søknad';

async function svarPåLivssituasjonMedArbeidIUtlandet(page: Page, land: string) {
    await svar(page, 'Er du asylsøker?', 'Nei');
    await svar(page, /^Oppholder du deg, eller har du oppholdt deg, utenfor Norge uten å arbeide\?/, 'Nei');
    await svar(page, 'Får eller har du fått pensjon fra utlandet?', 'Nei');
    await svar(page, /^Arbeider eller har du arbeidet utenfor Norge/, 'Ja');
    await page.getByRole('button', { name: 'Legg til arbeidsperiode' }).click();
    const dialog = page.getByRole('dialog', { name: 'Legg til arbeidsperiode utenfor Norge' });
    await dialog
        .getByRole('radiogroup', { name: 'Er arbeidsperioden avsluttet?' })
        .getByRole('radio', { name: 'Nei' })
        .check();
    await dialog.getByRole('combobox', { name: 'Hvilket land arbeider du i?' }).selectOption(land);
    await dialog.getByRole('textbox', { name: 'Arbeidsgiver' }).fill('Arbeidsgiver AS');
    await dialog.getByRole('textbox', { name: 'Når startet arbeidsperioden?' }).fill('01.2024');
    await dialog.getByRole('checkbox', { name: 'Jeg vet ikke når arbeidsperioden avsluttes' }).check();
    await dialog.getByRole('checkbox', { name: 'Jeg kjenner ikke adressen' }).check();
    await dialog.getByRole('button', { name: 'Legg til arbeidsperiode' }).click();
    await expect(dialog).toBeHidden();
}

async function fyllUtEøsForSøker(page: Page) {
    await page.getByRole('textbox', { name: 'Hva er id-nummeret ditt i Danmark?' }).fill('010190-1234');
    await page
        .getByRole('textbox', { name: 'Hvor bor du i perioden du søker om kontantstøtte?' })
        .fill('Solveien 2A, 2304 Hamar');
    await svar(page, /^Arbeider eller har du arbeidet i Norge/, 'Nei');
    await svar(page, 'Får du eller har du fått pensjon fra Norge?', 'Nei');
    await svar(page, /^Får du eller har du fått utbetalinger som erstatter arbeidsinntekt/, 'Nei');
}

async function fyllUtEøsForBarnet(page: Page) {
    await page
        .getByRole('combobox', { name: `Hva er slektsforholdet ditt til ${BARN.navn}?` })
        .selectOption('Forelder');
    await svar(page, `Bor ${BARN.navn} sammen med den andre forelderen?`, 'Nei');
    await svar(page, `Bor ${BARN.navn} sammen med en annen omsorgsperson?`, 'Nei');
    const andreForelder = page.getByRole('group', { name: `${BARN.navn} sin andre forelder` });
    await andreForelder.getByRole('checkbox', { name: 'Jeg kjenner ikke adressen' }).check();
    for (const radiogruppe of await andreForelder.getByRole('radiogroup').all()) {
        await radiogruppe.getByRole('radio', { name: 'Nei', exact: true }).check();
    }
}

test.describe('EØS', () => {
    test('skal legge til EØS-steg når søkeren har arbeidet i et EØS-land', async ({ page }) => {
        await gåTilSteg(page, Steg.DinLivssituasjon);
        await expect(page.getByText('Steg 2 av 7')).toBeVisible();

        await svarPåLivssituasjonMedArbeidIUtlandet(page, 'Danmark');

        await expect(page.getByText('Steg 2 av 8')).toBeVisible();
    });

    test('skal ikke legge til EØS-steg når søkeren har arbeidet i et land utenfor EØS', async ({ page }) => {
        await gåTilSteg(page, Steg.DinLivssituasjon);

        await svarPåLivssituasjonMedArbeidIUtlandet(page, 'Japan');

        await expect(page.getByRole('definition').getByText('Japan', { exact: true })).toBeVisible();
        await expect(page.getByText('Steg 2 av 7')).toBeVisible();
    });

    test('skal sende inn søknad med EØS-opplysninger om søkeren og barnet', async ({ page }) => {
        await gåTilSteg(page, Steg.DinLivssituasjon);
        await svarPåLivssituasjonMedArbeidIUtlandet(page, 'Danmark');
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.VelgBarn);
        await fyllUtVelgBarn(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.OmBarna);
        await fyllUtOmBarna(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.OmBarnet);
        await fyllUtOmBarnet(page);
        await gåTilNesteSteg(page);

        await forventSteg(page, Steg.EøsForSøker);
        await expect(page.getByText('Steg 6 av 9')).toBeVisible();
        await fyllUtEøsForSøker(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.EøsForBarnet);
        await fyllUtEøsForBarnet(page);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.Oppsummering);
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.Dokumentasjon);

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();

        const søknad: ISøknadKontrakt = (await innsending).postDataJSON();
        expect(søknad.antallEøsSteg).toBe(2);
        expect(søknad.søker.harEøsSteg).toBe(true);
        expect(søknad.søker.arbeidsperioderUtland).toHaveLength(1);
        expect(søknad.barn[0].harEøsSteg).toBe(true);
        await expect(page.getByText(/^Søknaden din om kontantstøtte er mottatt/)).toBeVisible();
    });
});
