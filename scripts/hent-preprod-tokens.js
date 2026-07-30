// Henter gyldige OBO-tokens fra tokenx-token-generator ved å automatisere den interaktive
// TestId-innloggingen i en nettleser (Playwright), og lagrer resultatene i .env.
// Brukes av 'lokalt-mot-preprod'-profilen (se README) for å autentisere mot de ekte dev-gcp-tjenestene.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import PREPROD_APPLIKASJONER from '../src/common/preprodApplikasjoner.json' with { type: 'json' };

const envPath = fileURLToPath(new URL('../.env', import.meta.url));

async function main() {
    const fnr = await spørOmFnr();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    try {
        for (const { applicationName, envVar } of PREPROD_APPLIKASJONER) {
            const accessToken = await hentToken(context, applicationName, fnr);
            oppdaterEnvFil(envVar, accessToken);
            console.log(`${envVar} er oppdatert i .env`);
        }
    } finally {
        await browser.close();
    }
}

async function spørOmFnr() {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try {
        const svar = await rl.question('Fødselsnummer (la stå tomt for å bruke tilfeldig testperson): ');
        return svar.trim();
    } finally {
        rl.close();
    }
}

const PID_SELECTOR = 'input#pid';

async function hentToken(context, applicationName, fnr) {
    const page = await context.newPage();
    try {
        const audience = `dev-gcp:teamfamilie:${applicationName}`;
        await page.goto(`https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=${audience}`);

        const testIdLenke = page.locator('a[href="/authorize/testid2"]');
        if (await testIdLenke.isVisible().catch(() => false)) {
            await testIdLenke.click();

            const fnrFelt = page.locator(PID_SELECTOR);
            if (fnr) {
                await fnrFelt.fill(fnr);
            } else {
                await page.locator('#populatePersonButton').click();
                await ventPåUtfyltVerdi(page);
            }
            await page.locator('#submit').click();
        }

        await page.waitForURL(/tokenx-token-generator\.intern\.dev\.nav\.no\/api\/obo/, { timeout: 30_000 });
        const responseText = await page.locator('body').innerText();
        const { access_token: accessToken } = JSON.parse(responseText);

        if (!accessToken) {
            throw new Error(`Fant ikke access_token i responsen for ${applicationName}.`);
        }
        return accessToken;
    } finally {
        await page.close();
    }
}

async function ventPåUtfyltVerdi(page, timeoutMs = 10_000) {
    try {
        await page.waitForFunction(
            selector => (document.querySelector(selector)?.value ?? '').trim().length > 0,
            PID_SELECTOR,
            { timeout: timeoutMs }
        );
    } catch {
        throw new Error('Tidsavbrudd: fødselsnummer-feltet ble ikke fylt ut av "Hent tilfeldig person".');
    }
}

function oppdaterEnvFil(envVar, accessToken) {
    const linje = `${envVar}=${accessToken}`;

    if (!existsSync(envPath)) {
        writeFileSync(envPath, `${linje}\n`);
        return;
    }

    const eksisterendeLinjer = readFileSync(envPath, 'utf-8').split('\n');
    const indeks = eksisterendeLinjer.findIndex(l => l.startsWith(`${envVar}=`));

    if (indeks >= 0) {
        eksisterendeLinjer[indeks] = linje;
    } else {
        eksisterendeLinjer.push(linje);
    }

    writeFileSync(envPath, eksisterendeLinjer.join('\n'));
}

main().catch(error => {
    console.error('Klarte ikke å hente tokens:', error);
    process.exitCode = 1;
});
