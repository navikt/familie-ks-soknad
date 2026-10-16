import { expect, type Page, type Request } from '@playwright/test';

import { BASE_PATH } from '../src/common/miljø';

export const INNSENDING_URL = `${BASE_PATH}api/soknad/kontantstotte/v6`;
export const MELLOMLAGRING_URL = `${BASE_PATH}dokument/soknad/kontantstotte`;
export const VEDLEGG_URL = `${BASE_PATH}dokument/mapper/familievedlegg`;

// Fra personopplysning.ts
export const SØKER = { navn: 'Voksen Voksnessen', ident: '23058518298' };
export const BARN = { navn: 'Barn Barnessen III', ident: '12345678987' };

// Syntetisk fødselsnummer (Tenor) som ikke tilhører en ekte person.
export const ANDRE_FORELDER = { navn: 'Annen Forelder', ident: '15859040087' };

export enum Steg {
    OmDeg = 'Om deg',
    DinLivssituasjon = 'Livssituasjonen din',
    VelgBarn = 'Hvilke barn søker du for?',
    OmBarna = 'Om barna dine',
    OmBarnet = 'Om Barn Barnessen III',
    EøsForSøker = 'Kontantstøtte etter EØS-reglene - Om deg',
    EøsForBarnet = 'Kontantstøtte etter EØS-reglene - Om Barn Barnessen III',
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

export async function fyllUtOmDeg(page: Page) {
    await svar(page, 'Bor du på denne adressen?', 'Ja');
    await svar(page, /^Har du oppholdt deg sammenhengende i Norge de siste tolv månedene\?/, 'Ja');
    await svar(page, 'Planlegger du å bo sammenhengende i Norge i mer enn tolv måneder?', 'Ja');
    await svar(page, 'Har du bodd eller vært yrkesaktiv i Norge eller et annet EØS-land i minst fem år?', 'Ja');
}

export async function fyllUtDinLivssituasjon(page: Page) {
    await svar(page, 'Er du asylsøker?', 'Nei');
    await svar(page, /^Arbeider eller har du arbeidet utenfor Norge/, 'Nei');
    await svar(page, /^Oppholder du deg, eller har du oppholdt deg, utenfor Norge uten å arbeide\?/, 'Nei');
    await svar(page, 'Får eller har du fått pensjon fra utlandet?', 'Nei');
}

export async function fyllUtVelgBarn(page: Page) {
    await page.getByRole('checkbox', { name: `Søk om kontantstøtte for barnet ${BARN.navn}` }).check();
}

export async function fyllUtOmBarna(page: Page) {
    await svar(page, 'Er noen av barna fosterbarn?', 'Nei');
    await svar(page, 'Er noen av barna i barnverninstitusjon?', 'Nei');
    await svar(page, 'Er noen av barna adoptert?', 'Nei');
    await svar(page, 'Er det søkt om asyl i Norge for noen av barna?', 'Nei');
    await svar(page, /^Har barna oppholdt seg sammenhengende i Norge de siste tolv månedene\?/, 'Ja');
    await svar(
        page,
        /^Får du, har du fått eller har du søkt om kontantstøtte for noen av barna fra et annet EØS-land/,
        'Nei'
    );
    await svar(page, /^Har noen av barna barnehageplass nå/, 'Nei');
}

export async function fyllUtOmBarnet(page: Page) {
    await page.getByRole('textbox', { name: 'Navn' }).fill(ANDRE_FORELDER.navn);
    await page.getByRole('textbox', { name: 'Fødselsnummer eller d-nummer' }).fill(ANDRE_FORELDER.ident);
    await svar(page, /^Har Barn Barnessen III sin andre forelder bodd eller vært yrkesaktiv/, 'Ja');
    await svar(page, /^Arbeider eller har Barn Barnessen III sin andre forelder arbeidet utenfor Norge/, 'Nei');
    await svar(page, /^Oppholder eller har Barn Barnessen III sin andre forelder oppholdt seg utenfor Norge/, 'Nei');
    await svar(page, /^Får eller har Barn Barnessen III sin andre forelder fått pensjon fra utlandet\?/, 'Nei');
    await svar(page, `Bor ${BARN.navn} fast sammen med deg?`, 'Ja');
    await svar(page, `Bor du sammen med den andre forelderen til ${BARN.navn}?`, 'Ja');
}

const ORDINÆR_NASJONAL_SØKNAD: { steg: Steg; fyllUt: (page: Page) => Promise<void> }[] = [
    { steg: Steg.OmDeg, fyllUt: fyllUtOmDeg },
    { steg: Steg.DinLivssituasjon, fyllUt: fyllUtDinLivssituasjon },
    { steg: Steg.VelgBarn, fyllUt: fyllUtVelgBarn },
    { steg: Steg.OmBarna, fyllUt: fyllUtOmBarna },
    { steg: Steg.OmBarnet, fyllUt: fyllUtOmBarnet },
    { steg: Steg.Oppsummering, fyllUt: async () => {} },
    { steg: Steg.Dokumentasjon, fyllUt: async () => {} },
];

export async function forventSteg(page: Page, steg: Steg) {
    await expect(page.getByRole('heading', { level: 2, name: steg, exact: true })).toBeVisible();
}

/**
 * Starter en søknad for ett barn uten tilknytning til utlandet, og fyller ut alle stegene før `steg`.
 */
export async function gåTilSteg(page: Page, steg: Steg) {
    await startSøknad(page);
    for (const { steg: nåværendeSteg, fyllUt } of ORDINÆR_NASJONAL_SØKNAD) {
        await forventSteg(page, nåværendeSteg);
        if (nåværendeSteg === steg) {
            return;
        }
        await fyllUt(page);
        await gåTilNesteSteg(page);
    }
    throw new Error(`Steget «${steg}» er ikke med i en søknad uten tilknytning til utlandet`);
}

export function erInnsending(request: Request) {
    return request.method() === 'POST' && new URL(request.url()).pathname === INNSENDING_URL;
}

export async function lastOppFil(page: Page, fil: { name: string; mimeType: string; buffer: Buffer }) {
    const filvelger = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Velg filer' }).click();
    await (await filvelger).setFiles(fil);
}

export const PDF = { name: 'vedlegg.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') };

// Aksel FormSummary har ingen landmark-rolle, så bolken finnes via overskriften.
export function oppsummeringsbolk(page: Page, tittel: string) {
    return page
        .locator('.aksel-form-summary')
        .filter({ has: page.getByRole('heading', { level: 3, name: tittel, exact: true }) });
}
