import { apiClient } from '@api/client/apiClient';
import type { EAllFeatureToggles } from '../../common/feature-toggles';
import { BASE_PATH } from '../../common/miljø';

export async function hentFeatureToggles(): Promise<EAllFeatureToggles> {
    return apiClient.get<void, EAllFeatureToggles>({
        url: `${BASE_PATH}toggles/all`,
    });
}
