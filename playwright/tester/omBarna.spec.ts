import { expect, test } from '../fixtures';
import { ANDRE_FORELDER, BARN, forventSteg, fyllUtOmBarna, gåTilNesteSteg, gåTilSteg, Steg, svar } from '../søknad';

test.describe('Om barna', () => {
    test('skal spørre hvilke barn som har oppholdt seg utenfor Norge', async ({ page }) => {
        await gåTilSteg(page, Steg.OmBarna);
        await fyllUtOmBarna(page);
        const hvemAvBarna = page.getByRole('group', {
            name: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
        });
        await expect(hvemAvBarna).toBeHidden();

        await svar(page, /^Har barna oppholdt seg sammenhengende i Norge de siste tolv månedene\?/, 'Nei');
        await gåTilNesteSteg(page);

        await expect(hvemAvBarna.getByRole('checkbox', { name: BARN.navn })).toBeVisible();
        await expect(
            hvemAvBarna.getByText(
                'Du må oppgi hvem av barna som har oppholdt seg utenfor Norge i løpet av de siste tolv månedene for å gå videre'
            )
        ).toBeVisible();
        await forventSteg(page, Steg.OmBarna);
    });
});

test.describe('Om barnet', () => {
    test('skal ikke spørre om den andre forelderen når søkeren ikke kan gi opplysninger', async ({ page }) => {
        await gåTilSteg(page, Steg.OmBarnet);
        const andreForelder = page.getByRole('group', { name: 'Barnets andre forelder' });

        await andreForelder
            .getByRole('checkbox', { name: 'Jeg kan ikke gi opplysninger om den andre forelderen' })
            .check();

        await expect(andreForelder.getByRole('textbox', { name: 'Navn' })).toBeDisabled();
        await expect(andreForelder.getByRole('radiogroup')).toHaveCount(0);
        await svar(page, `Bor ${BARN.navn} fast sammen med deg?`, 'Ja');
        await svar(page, `Bor du sammen med den andre forelderen til ${BARN.navn}?`, 'Ja');
        await gåTilNesteSteg(page);
        await forventSteg(page, Steg.Oppsummering);
    });

    test('skal avvise ugyldig fødselsnummer for den andre forelderen', async ({ page }) => {
        await gåTilSteg(page, Steg.OmBarnet);
        const andreForelder = page.getByRole('group', { name: 'Barnets andre forelder' });
        await andreForelder.getByRole('textbox', { name: 'Navn' }).fill(ANDRE_FORELDER.navn);

        await andreForelder.getByRole('textbox', { name: 'Fødselsnummer eller d-nummer' }).fill('12345678901');
        await gåTilNesteSteg(page);

        await expect(
            andreForelder.getByText('Du må oppgi et gyldig fødselsnummer eller d-nummer med 11 siffer')
        ).toBeVisible();
        await forventSteg(page, Steg.OmBarnet);
    });
});
