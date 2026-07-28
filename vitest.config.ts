import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        // Backend kompileres til dist med tsc, og uten denne ville de kompilerte
        // testfilene i dist blitt kjørt i tillegg til kildefilene i src.
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
