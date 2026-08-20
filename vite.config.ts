import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { BASE_PATH } from './src/common/miljø';

export default defineConfig({
    root: path.resolve(__dirname, 'src/frontend'),
    base: BASE_PATH,
    plugins: [react()],
    server: {
        // Tillat at vite dev-serveren leser filer utenfor src/frontend (f.eks. src/common)
        fs: {
            allow: [path.resolve(__dirname)],
        },
    },
    build: {
        // Backend serverer statiske filer fra denne mappen, se src/backend/routes/static.ts
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: false,
        sourcemap: true,
        rolldownOptions: {
            // To separate HTML-innganger: index.html (hovedappen) og disabled.html
            // (killswitch-siden, se src/backend/middlewares/feature-toggles.ts sitt
            // res.render('disabled.html', ...) og src/frontend/disabled.tsx).
            input: {
                index: path.resolve(__dirname, 'src/frontend/index.html'),
                disabled: path.resolve(__dirname, 'src/frontend/disabled.html'),
            },
        },
    },
});
