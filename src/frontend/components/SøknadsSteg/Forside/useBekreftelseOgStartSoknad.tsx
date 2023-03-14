import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useSteg } from '../../../context/StegContext';
import { ISteg } from '../../../typer/routes';
import { logForsettPåSøknad, logSkjemaStartet } from '../../../utils/amplitude';

export enum BekreftelseStatus {
    NORMAL = 'NORMAL',
    BEKREFTET = 'BEKREFTET',
    FEIL = 'FEIL',
}

export const useBekreftelseOgStartSoknad = (): {
    onStartSøknad: (event: React.FormEvent) => void;
    bekreftelseOnChange: () => void;
    bekreftelseStatus: BekreftelseStatus;
    fortsettPåSøknaden: () => void;
    startPåNytt: () => void;
    visStartPåNyttModal: boolean;
    settVisStartPåNyttModal: (synlig: boolean) => void;
} => {
    const navigate = useNavigate();
    const [visStartPåNyttModal, settVisStartPåNyttModal] = useState(false);

    const { steg, hentNesteSteg, hentNåværendeStegIndex, settBarnForSteg } = useSteg();
    const {
        søknad,
        settSøknad,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        brukMellomlagretVerdi,
        avbrytOgSlettSøknad,
        mellomlagretVerdi,
    } = useApp();
    const { settBarnSomTriggerEøs, skalTriggeEøsForBarn, settSøkerTriggerEøs } = useEøs();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        søknad.lestOgForståttBekreftelse ? BekreftelseStatus.BEKREFTET : BekreftelseStatus.NORMAL
    );

    const [gjenopprettetFraMellomlagring, settGjenpprettetFraMellomlagring] = useState(false);

    const nesteRoute: ISteg = hentNesteSteg();
    const nåværendeStegIndex = hentNåværendeStegIndex();

    useEffect(() => {
        if (gjenopprettetFraMellomlagring && mellomlagretVerdi) {
            navigate(steg[mellomlagretVerdi.sisteUtfylteStegIndex].path);
            settGjenpprettetFraMellomlagring(false);
        }
    }, [gjenopprettetFraMellomlagring]);

    const fortsettPåSøknaden = (): void => {
        if (mellomlagretVerdi) {
            const {
                søknad: { barnInkludertISøknaden, søker },
            } = mellomlagretVerdi;

            brukMellomlagretVerdi();
            settBarnForSteg(barnInkludertISøknaden);
            settBarnSomTriggerEøs(
                barnInkludertISøknaden
                    .filter(barn => skalTriggeEøsForBarn(barn))
                    .map(barn => barn.id)
            );
            settSøkerTriggerEøs(søker.triggetEøs);
            settGjenpprettetFraMellomlagring(true);
        } else {
            navigate(nesteRoute.path);
        }
        logForsettPåSøknad();
    };

    const startPåNytt = (): void => {
        avbrytOgSlettSøknad();
    };

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();
        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET) {
            settSøknad({
                ...søknad,
                lestOgForståttBekreftelse: true,
            });
            if (!erStegUtfyltFrafør(nåværendeStegIndex)) {
                settSisteUtfylteStegIndex(nåværendeStegIndex);
            }
            logSkjemaStartet();
            navigate(nesteRoute.path);
        } else {
            settBekreftelseStatus(BekreftelseStatus.FEIL);
        }
    };

    const bekreftelseOnChange = () => {
        settBekreftelseStatus(prevState => {
            return prevState !== BekreftelseStatus.BEKREFTET
                ? BekreftelseStatus.BEKREFTET
                : BekreftelseStatus.NORMAL;
        });
    };
    return {
        onStartSøknad,
        bekreftelseOnChange,
        bekreftelseStatus,
        fortsettPåSøknaden,
        startPåNytt,
        visStartPåNyttModal,
        settVisStartPåNyttModal,
    };
};
