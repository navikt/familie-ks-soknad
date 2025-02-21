import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

import { type Ressurs, RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../shared-utils/Miljø';
import { erModellMismatchResponsRessurs } from '../../shared-utils/modellversjon';
import { useApp } from '../context/AppContext';
import { useFeatureToggles } from '../context/FeatureToggleContext';
import { useSpråkContext } from '../context/SpråkContext';
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
    const { valgtLocale } = useSpråkContext();
    const { toggles } = useFeatureToggles();
    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });

        const kontraktVersjon = toggles.BRUK_NYTT_ENDEPUNKT_FOR_INNSENDING_AV_SOKNAD ? 5 : 4;

        try {
            const formatert: ISøknadKontrakt = dataISøknadKontraktFormat(
                valgtLocale,
                søknad,
                tekster(),
                tilRestLocaleRecord,
                kontraktVersjon
            );

            const res = await sendInn<ISøknadKontrakt>(
                formatert,
                axiosRequest,
                `${soknadApiProxyUrl}/soknad/kontantstotte/v${kontraktVersjon}`,
                (res: AxiosError) => {
                    const responseData = res.response?.data as Ressurs<IKvittering>;
                    if (responseData && erModellMismatchResponsRessurs(responseData)) {
                        settSisteModellVersjon(responseData.data.modellVersjon);
                    } else {
                        //Denne skal feile mykt, med en custom feilmelding til brukeren. Kaster dermed ingen feil her.
                        Sentry.captureException(
                            new Error('Klarte ikke sende inn søknaden', { cause: res.message })
                        );
                    }
                }
            );

            settInnsendingStatus(res);

            return [res.status === RessursStatus.SUKSESS, formatert];
        } catch (error) {
            throw new Error('Søknaden feilet på innsending', { cause: error });
        }
    };

    return {
        sendInnSkjema,
    };
};
