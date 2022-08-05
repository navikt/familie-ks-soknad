import { defineConfig } from 'cypress';

const baseUrlLocal = 'http://localhost:3000';

export default defineConfig({
    env: {
        baseUrl: baseUrlLocal,
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: baseUrlLocal,
        video: false,
    },
});
