import { defineConfig, devices } from '@playwright/test';

import { BASE_PATH } from './src/common/miljø';

// Egen port, slik at testene ikke gjenbruker en preview-server fra en annen app (f.eks. familie-ba-soknad).
const port = 8201;
const baseURL = `http://localhost:${port}`;

// Relativ til rotmappen i vite.config.ts (src/frontend).
const byggMappe = '../../playwright/.bygg';
const erCI = !!process.env.CI;

export default defineConfig({
    testDir: './playwright/tester',
    outputDir: './playwright/resultater',
    fullyParallel: true,
    forbidOnly: erCI,
    retries: erCI ? 2 : 0,
    workers: erCI ? 1 : undefined,
    reporter: [[erCI ? 'github' : 'list'], ['html', { outputFolder: './playwright/rapport', open: 'never' }]],
    use: {
        baseURL,
        locale: 'nb-NO',
        timezoneId: 'Europe/Oslo',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: [
            `pnpm exec vite build --outDir ${byggMappe} --emptyOutDir --logLevel error`,
            `pnpm exec vite preview --outDir ${byggMappe} --port ${port} --strictPort`,
        ].join(' && '),
        url: `${baseURL}${BASE_PATH}`,
        reuseExistingServer: !erCI,
        timeout: 120_000,
    },
});
