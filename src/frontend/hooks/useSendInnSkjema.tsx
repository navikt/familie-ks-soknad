import { AxiosError } from 'axios';

import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import { useSpråk } from '../context/SpråkContext';
import { ISøknadKontrakt } from '../typer/kontrakt/søknadKontrakt';
import { IKvittering } from '../typer/kvittering';
import { dataISøknadKontraktFormat } from '../utils/mappingTilKontrakt/søknad';
import { sendInn } from '../utils/sendInnSkjema';

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
} => {
    const {
        axiosRequest,
        søknad,
        settInnsendingStatus,
        settSisteModellVersjon,
        tekster,
        tilRestLocaleRecord,
    } = useApp();
    const { soknadApiProxyUrl } = Miljø();
    const { valgtLocale } = useSpråk();
    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const formatert: ISøknadKontrakt = dataISøknadKontraktFormat(
            valgtLocale,
            søknad,
            tekster(),
            tilRestLocaleRecord
        );

        const res = await sendInn<ISøknadKontrakt>(
            formatert,
            axiosRequest,
            `${soknadApiProxyUrl}/soknad/kontantstotte/v4`,
            (res: AxiosError) => {
                const responseData = res.response?.data as Ressurs<IKvittering>;
                if (responseData && erModellMismatchResponsRessurs(responseData)) {
                    settSisteModellVersjon(responseData.data.modellVersjon);
                }
            }
        );

        settInnsendingStatus(res);

        return [res.status === RessursStatus.SUKSESS, formatert];
    };

    return {
        sendInnSkjema,
    };
};
