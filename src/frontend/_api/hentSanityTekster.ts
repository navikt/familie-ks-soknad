import type { SanityDokument } from '../typer/sanity/sanity';
import { sanityKlient } from './client/sanity';

export async function hentSanityTekster() {
    return sanityKlient.fetch<SanityDokument[]>('*');
}
