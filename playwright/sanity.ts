import { readFileSync } from 'node:fs';

import { HttpResponse, http } from 'msw';

import type { SanityDokument } from '../src/frontend/typer/sanity/sanity';

/**
 * Øyeblikksbilde av tekstene i Sanity, slik at testene bruker ekte tekster uten å være avhengige av Sanity.
 * Oppdateres med `pnpm hent-sanity-dokumenter`.
 */
const dokumenter: SanityDokument[] = JSON.parse(
    readFileSync(new URL('./testdata/sanity-dokumenter.json', import.meta.url), 'utf-8')
);

export const sanityHandler = http.get('https://by26nl8j.apicdn.sanity.io/:apiVersjon/data/query/:dataset', () =>
    HttpResponse.json({ result: dokumenter })
);
