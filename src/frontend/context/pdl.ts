import type { Ressurs } from '@navikt/familie-typer';

import miljø from '../../shared-utils/miljø';
import { ISøkerRespons } from '../typer/person';

export const hentSluttbrukerFraPdl = (axiosRequest): Promise<Ressurs<ISøkerRespons>> => {
    const { soknadApiProxyUrl } = miljø();
    return axiosRequest({
        url: `${soknadApiProxyUrl}/personopplysning?ytelse=KONTANTSTOTTE`,
        method: 'GET',
        withCredentials: true,
        påvirkerSystemLaster: true,
    });
};
