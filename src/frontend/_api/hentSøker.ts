import { apiClient } from '@api/client/apiClient';
import miljø from '../../common/miljø';
import type { ISøkerRespons } from '../typer/person';

export async function hentSøker(): Promise<ISøkerRespons> {
    const { soknadApiProxyUrl } = miljø();
    return apiClient.get<void, ISøkerRespons>({
        url: `${soknadApiProxyUrl}/personopplysning?ytelse=KONTANTSTOTTE`,
        withCredentials: true,
    });
}
