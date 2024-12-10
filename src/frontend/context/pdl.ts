import type { Ressurs } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { ISøkerRespons } from '../typer/person';

export const hentSluttbrukerFraPdl = (axiosRequest): Promise<Ressurs<ISøkerRespons>> => {
    const { soknadApiProxyUrl } = Miljø();
    return axiosRequest({
        url: `${soknadApiProxyUrl}/personopplysning?ytelse=KONTANTSTOTTE`,
        method: 'GET',
        withCredentials: true,
        påvirkerSystemLaster: true,
    });
};
