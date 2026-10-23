import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@api': path.resolve(__dirname, 'src/frontend/_api'),
            '@hooks': path.resolve(__dirname, 'src/frontend/hooks'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        exclude: [...configDefaults.exclude, 'playwright/**'],
    },
});
