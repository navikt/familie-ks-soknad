import { byggFeiletRessurs, RessursStatus } from '@navikt/familie-typer';
import { HttpResponse, http } from 'msw';

import { BASE_PATH } from '../../src/common/miljø';
import { expect, test } from '../fixtures';

test.describe('Oppstart', () => {
    test('skal be søkere med adressebeskyttelse om å søke på papir', async ({ page, apiMock }) => {
        apiMock.use(
            http.get(`${BASE_PATH}api/personopplysning`, () =>
                HttpResponse.json(
                    { data: null, status: RessursStatus.IKKE_TILGANG, melding: 'Ikke tilgang', stacktrace: null },
                    { status: 403 }
                )
            )
        );

        await page.goto(BASE_PATH);

        await expect(page.getByRole('heading', { name: 'Du må søke på papir.' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeHidden();
    });

    test('skal vise feilside når personopplysningene ikke kan hentes', async ({ page, apiMock }) => {
        apiMock.use(
            http.get(`${BASE_PATH}api/personopplysning`, () =>
                HttpResponse.json(byggFeiletRessurs('Noe gikk galt'), { status: 500 })
            )
        );

        await page.goto(BASE_PATH);

        await expect(page.getByRole('heading', { level: 1, name: 'Beklager, noe gikk galt.' })).toBeVisible();
        await expect(page.getByRole('link', { name: /^laste ned og sende papirsøknad/ })).toBeVisible();
    });

    test('skal sende søkeren til forsiden når søknaden ikke er startet', async ({ page }) => {
        await page.goto(`${BASE_PATH}oppsummering`);

        await expect(page).toHaveURL(BASE_PATH);
        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
    });
});
