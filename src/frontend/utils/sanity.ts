import { ESanitySteg, SanityDokument } from '../typer/sanity/sanity';

export const innholdForStegHof = (dokumenter: SanityDokument[]) => (steg: ESanitySteg) =>
    dokumenter
        .filter(dok => dok.steg === steg)
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});

export const innholdForFellesHof = (dokumenter: SanityDokument[]) => (prefix: string) =>
    dokumenter
        .filter(dok => dok._type.includes(prefix))
        .reduce((acc, dok) => {
            return { ...acc, [dok.api_navn]: dok };
        }, {});
