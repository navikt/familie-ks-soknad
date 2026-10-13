import { apiClient } from '@api/client/apiClient';
import miljø from '../../common/miljø';

export async function verifiserInnloggetBruker(): Promise<string> {
    const { soknadApiProxyUrl } = miljø();
    return apiClient.get<void, string>({
        url: `${soknadApiProxyUrl}/innlogget/kontantstotte`,
        withCredentials: true,
    });
}
