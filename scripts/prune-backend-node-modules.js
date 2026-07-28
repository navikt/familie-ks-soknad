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
        throw new Error(`Fant ikke ${entryFile}. Kjør 'yarn build:backend' (tsc) før dette scriptet.`);
    }

    // Ignorerer filer som ikke er nødvendige for produksjon. @vercel/nft vil finne vite da den
    // importeres i backend-koden, men vite er kun nødvendig for utvikling og bygging, ikke for produksjon.
    const ignorerteFiler = ['node_modules/vite'];

    const { fileList } = await nodeFileTrace([entryFile], {
        base: rootDir,
        ignore: fil => ignorerteFiler.some(filNavn => fil.startsWith(filNavn)),
    });

    const nodeModuleFiler = [...fileList].filter(fil => fil.startsWith('node_modules/'));

    await rm(nodeModulesDir, { recursive: true, force: true });

    await Promise.all(
        nodeModuleFiler.map(async relativFil => {
            const src = join(rootDir, relativFil);
            const dest = join(distDir, relativFil);

            await mkdir(dirname(dest), { recursive: true });
            await cp(src, dest);
        })
    );

    console.log(
        `Sporet og kopierte ${nodeModuleFiler.length} filer fra node_modules til ${relative(rootDir, nodeModulesDir)}`
    );
}

main().catch(feil => {
    console.error(feil);
    process.exit(1);
});
