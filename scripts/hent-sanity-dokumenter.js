// Henter alle tekstene fra Sanity og lagrer dem som testdata for Playwright-testene (se playwright/sanity.ts).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { createClient } from '@sanity/client';

const filsti = fileURLToPath(new URL('../playwright/testdata/sanity-dokumenter.json', import.meta.url));
// Disse feltene endres ved hver publisering, også når teksten ikke er endret, og brukes ikke av appen.
const UTELATTE_FELTER = new Set(['_rev', '_createdAt', '_updatedAt']);

const sanityKlient = createClient({
    projectId: 'by26nl8j',
    dataset: 'ks-production',
    apiVersion: '2021-10-21',
    useCdn: true,
});

const dokumenter = (await sanityKlient.fetch('*'))
    .map(dokument => Object.fromEntries(Object.entries(dokument).filter(([felt]) => !UTELATTE_FELTER.has(felt))))
    .sort((a, b) => (a._id < b._id ? -1 : 1));

// Ett dokument per linje gir lesbare differ når tekstene oppdateres.
writeFileSync(filsti, `[\n${dokumenter.map(dokument => JSON.stringify(dokument)).join(',\n')}\n]\n`);

console.log(`Lagret ${dokumenter.length} dokumenter i ${filsti}`);
