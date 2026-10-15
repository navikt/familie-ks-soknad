import { expect, type Page } from '@playwright/test';

import { BASE_PATH } from '../src/common/miljø';

export const INNSENDING_URL = `${BASE_PATH}api/soknad/kontantstotte/v6`;
export const MELLOMLAGRING_URL = `${BASE_PATH}dokument/soknad/kontantstotte`;
export const VEDLEGG_URL = `${BASE_PATH}dokument/mapper/familievedlegg`;

// Fra personopplysning.ts
export const SØKER = { navn: 'Voksen Voksnessen', ident: '23058518298' };
export const BARN = { navn: 'Barn Barnessen III', ident: '12345678987' };

export enum Steg {
    OmDeg = 'Om deg',
    DinLivssituasjon = 'Livssituasjonen din',
    VelgBarn = 'Hvilke barn søker du for?',
    OmBarna = 'Om barna dine',
    OmBarnet = 'Om Barn Barnessen III',
    Oppsummering = 'Oppsummering',
    Dokumentasjon = 'Last opp dokumentasjon',
}

export async function svar(page: Page, spørsmål: string | RegExp, svar: string) {
    await page.getByRole('radiogroup', { name: spørsmål }).getByRole('radio', { name: svar, exact: true }).check();
}

export async function gåTilNesteSteg(page: Page) {
    await page.getByRole('button', { name: 'Neste steg' }).click();
}

export async function startSøknad(page: Page) {
    await page.goto(BASE_PATH);
    await page.getByRole('checkbox', { name: 'Jeg vil svare så godt jeg kan på spørsmålene i søknaden.' }).check();
    await page.getByRole('button', { name: 'Start søknad' }).click();
}

export async function forventSteg(page: Page, steg: Steg) {
    await expect(page.getByRole('heading', { level: 2, name: steg, exact: true })).toBeVisible();
}
