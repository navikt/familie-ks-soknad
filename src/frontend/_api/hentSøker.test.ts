import { apiClient } from '@api/client/apiClient';
import { lagSøker } from '@testutils/testdata/søkerTestdata';
import { describe, expect, test, vi } from 'vitest';
import { BASE_PATH } from '../../common/miljø';
import { hentSøker } from './hentSøker';

vi.mock('@api/client/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe('hentSøker', () => {
    test('kaller apiClient.get med riktig url og returnerer responsen', async () => {
        const søker = lagSøker();
        vi.mocked(apiClient.get).mockResolvedValue(søker);

        const result = await hentSøker();

        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith({
            url: `${BASE_PATH}api/personopplysning?ytelse=KONTANTSTOTTE`,
            withCredentials: true,
        });
        expect(result).toBe(søker);
    });

    test('propagerer feil fra apiClient.get', async () => {
        const feil = new Error('Noe gikk galt');
        vi.mocked(apiClient.get).mockRejectedValue(feil);

        await expect(hentSøker()).rejects.toThrow(feil);
    });
});
