// Sporer hvilke filer i node_modules som faktisk kreves av den bygde backend-koden,
// og kopierer kun disse til dist/node_modules.
import { existsSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeFileTrace } from '@vercel/nft';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(rootDir, 'dist');
const entryFile = join(distDir, 'backend/server.js');
const nodeModulesDir = join(distDir, 'node_modules');

async function main() {
    if (!existsSync(entryFile)) {
        throw new Error(`Fant ikke ${entryFile}. Kjør 'pnpm build:backend' (tsc) før dette scriptet.`);
    }

    // Fjern en eventuell tidligere pruning før sporing. Ellers vil @vercel/nft
    // resolve avhengigheter mot den gamle dist/node_modules (stier som starter med
    // "dist/node_modules/") som deretter filtreres bort under, slik at f.eks.
    // 'compression' ikke kopieres og produksjonsserveren feiler med ERR_MODULE_NOT_FOUND.
    await rm(nodeModulesDir, { recursive: true, force: true });

    // Ignorerer filer som ikke er nødvendige for produksjon. @vercel/nft vil finne vite da den importeres i backend-koden,
    // Vite er kun nødvendig for utvikling og bygging.
    const ignoredFiles = ['node_modules/vite'];

    const { fileList } = await nodeFileTrace([entryFile], {
        base: rootDir,
        ignore: fil => ignoredFiles.some(fileName => fil.startsWith(fileName)),
    });

    const nodeModuleFiles = [...fileList].filter(file => file.startsWith('node_modules/'));

    await Promise.all(
        nodeModuleFiles.map(async relativFil => {
            const src = join(rootDir, relativFil);
            const dest = join(distDir, relativFil);

            await mkdir(dirname(dest), { recursive: true });
            await cp(src, dest);
        })
    );

    console.log(
        `Sporet og kopierte ${nodeModuleFiles.length} filer fra node_modules til ${relative(rootDir, nodeModulesDir)}`
    );
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
