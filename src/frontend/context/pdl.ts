import { Ressurs } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { ISøkerRespons } from '../typer/person';

export const hentSluttbrukerFraPdl = (axiosRequest): Promise<Ressurs<ISøkerRespons>> => {
    const { soknadApi } = Miljø();
    return axiosRequest({
        url: `${soknadApi}/personopplysning?ytelse=KONTANTSTOTTE`,
        method: 'GET',
        withCredentials: true,
        påvirkerSystemLaster: true,
    });
};
