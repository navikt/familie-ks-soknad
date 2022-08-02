import { AxiosError } from 'axios';

import { Ressurs } from '@navikt/familie-typer';

import { modellVersjon, modellVersjonHeaderName } from '../../shared-utils/modellversjon';
import { AxiosRequest } from '../context/LastRessurserContext';
import { IKvittering } from '../typer/kvittering';

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
