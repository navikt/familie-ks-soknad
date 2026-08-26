import { apiClient } from '@api/client/apiClient';
import { describe, expect, test, vi } from 'vitest';
import type { EAllFeatureToggles } from '../../common/feature-toggles';
import { BASE_PATH } from '../../common/miljø';
import { hentFeatureToggles } from './hentFeatureToggles';

vi.mock('@api/client/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe('hentFeatureToggles', () => {
    test('kaller apiClient.get med riktig url og returnerer responsen', async () => {
        const mockToggles = {} as EAllFeatureToggles;
        vi.mocked(apiClient.get).mockResolvedValue(mockToggles);

        const result = await hentFeatureToggles();

        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith({ url: `${BASE_PATH}toggles/all` });
        expect(result).toBe(mockToggles);
    });

    test('propagerer feil fra apiClient.get', async () => {
        const feil = new Error('Noe gikk galt');
        vi.mocked(apiClient.get).mockRejectedValue(feil);

        await expect(hentFeatureToggles()).rejects.toThrow(feil);
    });
});
