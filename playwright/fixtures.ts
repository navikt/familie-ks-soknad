import { test as base, expect } from '@playwright/test';

import { handlers } from '../mocks/handlers';
import { type ApiMock, settOppApiMock } from './apiMock';
import { lagMellomlager, type Mellomlager } from './mellomlager';
import { personopplysningHandler } from './personopplysning';
import { sanityHandler } from './sanity';

interface Fixtures {
    apiMock: ApiMock;
    /** Erstatter mellomlagringsmockene med en mellomlagring som husker søknaden. Se `mellomlager.ts`. */
    mellomlager: Mellomlager;
}

export const test = base.extend<Fixtures>({
    apiMock: [
        async ({ page, baseURL }, use) => {
            if (!baseURL) {
                throw new Error('baseURL må være satt i playwright.config.ts');
            }

            const apiMock = await settOppApiMock(page, new URL(baseURL).origin, [
                sanityHandler,
                personopplysningHandler,
                ...handlers,
            ]);

            await use(apiMock);

            await page.unrouteAll({ behavior: 'ignoreErrors' });
            expect(
                apiMock.ubehandledeKall,
                'Det ble gjort kall uten mock-handler. Legg til handler i mocks/handlers.ts, bruk apiMock.use() i testen, eller tillat ressursen i apiMock.ts.'
            ).toEqual([]);
        },
        { auto: true },
    ],
    mellomlager: async ({ apiMock }, use) => {
        const mellomlager = lagMellomlager();

        apiMock.use(...mellomlager.handlers);
        await use(mellomlager);
    },
});

export { expect };
