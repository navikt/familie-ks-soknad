import type { ErrorEvent } from '@sentry/react';
import { vi } from 'vitest';
import { mockDeep, mockFn } from 'vitest-mock-extended';

import { fjernPersonopplysninger } from './sentry';

describe('sentry', () => {
    it('filtrerer fødselsnummer', () => {
        const breadcrumbData = { fnr: '123456 78901' };
        const event = mockDeep<ErrorEvent>({
            message: '12345678901',
            breadcrumbs: [
                {
                    data: breadcrumbData,
                    message: '12345678901',
                },
            ],
        });
        const stringifiedBreadcrumbData = JSON.stringify(breadcrumbData);

        const stringify = mockFn();
        stringify.calledWith(event.breadcrumbs?.slice(0, 1)[0].data).mockReturnValue(stringifiedBreadcrumbData);
        const stringifySpy = vi.spyOn(JSON, 'stringify').mockImplementation(stringify);
        const rensketEvent = fjernPersonopplysninger(event);
        stringifySpy.mockRestore();

        const filtered = JSON.stringify(rensketEvent);
        expect(filtered.indexOf('12345678901')).toEqual(-1);
        expect(filtered.indexOf('123456 78901')).toEqual(-1);
        expect(filtered.match(/<fnr>/g) || []).toHaveLength(3);
    });
});
