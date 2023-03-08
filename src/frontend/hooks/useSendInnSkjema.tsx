import { useSprakContext } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import { ISøknadKontrakt } from '../typer/kontrakt/v1';
import { dataISøknadKontraktFormatV1 } from '../utils/mappingTilKontrakt/søknad';
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
    const [valgtSpråk] = useSprakContext();
    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const formatert: ISøknadKontrakt = dataISøknadKontraktFormatV1(
            valgtSpråk,
            søknad,
            tekster(),
            tilRestLocaleRecord
        );

        const res = await sendInn<ISøknadKontrakt>(
            formatert,
            axiosRequest,
            `${soknadApiProxyUrl}/soknad/kontantstotte/v3`,
            res => {
                const responseData = res.response?.data;
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
