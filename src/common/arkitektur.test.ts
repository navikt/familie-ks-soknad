import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

const importsIFil = (filePath: string): string[] => {
    const innhold = readFileSync(filePath, 'utf-8');
    const importRegex = /from ['"](.+?)['"]/g;
    return [...innhold.matchAll(importRegex)].map(match => match[1]);
};

const filerIMappe = (mappe: string, filer: string[] = []): string[] => {
    readdirSync(mappe).forEach((fil: string) => {
        const fullPath = join(mappe, fil);
        if (statSync(fullPath).isDirectory()) {
            filerIMappe(fullPath, filer);
        } else if (fil.endsWith('.ts') || fil.endsWith('.tsx')) {
            filer.push(fullPath);
        }
    });
    return filer;
};

// Håndhever arkitekturregler for prosjektet, slik at frontend, backend og common ikke importerer fra hverandre
describe('Arkitektur for prosjekt', () => {
    it('frontend skal ikke importere fra backend', () => {
        const frontendFiler = filerIMappe('src/frontend');
        const alleUgyldigeImports: string[] = [];

        frontendFiler.forEach(fil => {
            const imports = importsIFil(fil);
            const ugyldigeImports = imports.filter(imp => imp.includes('../backend'));
            if (ugyldigeImports.length > 0) {
                alleUgyldigeImports.push(`${fil}: ${ugyldigeImports.join(', ')}`);
            }
        });

        expect(
            alleUgyldigeImports,
            `Frontend filer som importerer fra backend:\n${alleUgyldigeImports.join('\n')}\n`
        ).toHaveLength(0);
    });

    it('backend skal ikke importere fra frontend', () => {
        const backendFiler = filerIMappe('src/backend');
        const alleUgyldigeImports: string[] = [];

        backendFiler.forEach(fil => {
            const imports = importsIFil(fil);
            const ugyldigeImports = imports.filter(imp => imp.includes('../frontend'));
            if (ugyldigeImports.length > 0) {
                alleUgyldigeImports.push(`${fil}: ${ugyldigeImports.join(', ')}`);
            }
        });

        expect(
            alleUgyldigeImports,
            `Backend filer som importerer fra frontend:\n${alleUgyldigeImports.join('\n')}\n`
        ).toHaveLength(0);
    });

    it('common skal ikke importere fra frontend eller backend', () => {
        const commonFiler = filerIMappe('src/common');
        const alleUgyldigeImports: string[] = [];

        commonFiler.forEach(fil => {
            const imports = importsIFil(fil);
            const ugyldigeImports = imports.filter(imp => imp.includes('../frontend') || imp.includes('../backend'));
            if (ugyldigeImports.length > 0) {
                alleUgyldigeImports.push(`${fil}: ${ugyldigeImports.join(', ')}`);
            }
        });

        expect(
            alleUgyldigeImports,
            `Common filer som importerer fra frontend/backend:\n${alleUgyldigeImports.join('\n')}\n`
        ).toHaveLength(0);
    });
});
