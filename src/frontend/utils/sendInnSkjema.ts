import type { Ressurs } from '@navikt/familie-typer';
import type { AxiosError } from 'axios';

import { modellVersjon, modellVersjonHeaderName } from '../../common/modellversjon';
import type { AxiosRequest } from '../context/LastRessurserContext';
import type { IKvittering } from '../typer/kvittering';

export const sendInn = async <T>(
    formatert: T,
    axiosRequest: AxiosRequest,
    søknadApiPath: string,
    rejectCallback?: (res: AxiosError) => void
): Promise<Ressurs<IKvittering>> =>
    await axiosRequest<IKvittering, T>({
        url: søknadApiPath,
        method: 'POST',
        withCredentials: true,
        data: formatert,
        headers: {
            [modellVersjonHeaderName]: modellVersjon,
        },
        rejectCallback,
    });
