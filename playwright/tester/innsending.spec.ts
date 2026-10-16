import { byggFeiletRessurs, byggSuksessRessurs } from '@navikt/familie-typer';
import { HttpResponse, http } from 'msw';

import { BASE_PATH } from '../../src/common/miljø';
import { modellMismatchMelding, modellVersjon, modellVersjonHeaderName } from '../../src/common/modellversjon';
import type { ISøknadKontrakt } from '../../src/common/typer/kontrakt/søknadKontrakt';
import { expect, test } from '../fixtures';
import {
    BARN,
    erInnsending,
    fyllUtDinLivssituasjon,
    gåTilNesteSteg,
    gåTilSteg,
    INNSENDING_URL,
    Steg,
    SØKER,
} from '../søknad';

test.describe('Innsending', () => {
    test('skal sende inn søknaden og vise kvittering', async ({ page, mellomlager }) => {
        await gåTilSteg(page, Steg.Dokumentasjon);
        await expect.poll(() => mellomlager.lagret()).toBeDefined();

        const innsending = page.waitForRequest(erInnsending);
        await page.getByRole('button', { name: 'Send søknad' }).click();
        const request = await innsending;

        expect(request.headers()[modellVersjonHeaderName.toLowerCase()]).toBe(String(modellVersjon));
        const søknad: ISøknadKontrakt = request.postDataJSON();
        expect(søknad).toMatchObject({
            kontraktVersjon: 6,
            antallEøsSteg: 0,
            søker: { ident: { verdi: { nb: SØKER.ident } }, harEøsSteg: false },
        });
        expect(søknad.barn.map(barn => barn.ident.verdi.nb)).toEqual([BARN.ident]);

        await expect(page).toHaveURL(`${BASE_PATH}kvittering`);
        await expect(page.getByText('Søknaden din om kontantstøtte er mottatt 09:30, 15.01.26.')).toBeVisible();
        await expect(page.getByText('815.493.00')).toBeVisible();
        await expect.poll(() => mellomlager.lagret()).toBeUndefined();
    });

    test('skal vise feilmelding og beholde søknaden når innsendingen feiler', async ({
        page,
        apiMock,
        mellomlager,
    }) => {
        apiMock.use(
            http.post(INNSENDING_URL, () => HttpResponse.json(byggFeiletRessurs('Noe gikk galt'), { status: 500 }))
        );
        await gåTilSteg(page, Steg.Dokumentasjon);
        await expect.poll(() => mellomlager.lagret()).toBeDefined();

        await page.getByRole('button', { name: 'Send søknad' }).click();

        await expect(page.getByRole('heading', { name: 'Beklager, noe gikk galt.' })).toBeVisible();
        await expect(page).toHaveURL(`${BASE_PATH}dokumentasjon`);
        expect(mellomlager.lagret()).toBeDefined();
    });

    test('skal be søkeren starte på nytt når søknaden er laget med en utdatert modell', async ({ page, apiMock }) => {
        apiMock.use(
            http.post(INNSENDING_URL, () =>
                HttpResponse.json(
                    {
                        data: { modellVersjon: modellVersjon + 1 },
                        status: 'FEILET',
                        melding: modellMismatchMelding,
                        stacktrace: '',
                    },
                    { status: 403 }
                )
            )
        );
        await gåTilSteg(page, Steg.Dokumentasjon);

        await page.getByRole('button', { name: 'Send søknad' }).click();

        const dialog = page.getByRole('dialog', { name: 'Vi har mistet informasjonen din' });
        await expect(dialog).toBeVisible();
        await dialog.getByRole('button', { name: 'Start søknad på nytt' }).click();

        await expect(page).toHaveURL(BASE_PATH);
        await expect(page.getByRole('button', { name: 'Start søknad' })).toBeVisible();
    });
});

test.describe('Ny versjon av søknaden', () => {
    test('skal be søkeren starte på nytt når det kommer en ny versjon under utfyllingen', async ({ page, apiMock }) => {
        await gåTilSteg(page, Steg.DinLivssituasjon);
        apiMock.use(
            http.get(`${BASE_PATH}modellversjon`, () => HttpResponse.json(byggSuksessRessurs(modellVersjon + 1)))
        );

        await fyllUtDinLivssituasjon(page);
        await gåTilNesteSteg(page);

        await expect(page.getByRole('dialog', { name: 'Vi har mistet informasjonen din' })).toBeVisible();
    });
});
