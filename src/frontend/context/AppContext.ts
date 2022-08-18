import { useEffect, useState } from 'react';

import { PortableTextBlock } from '@portabletext/types';
import createUseContext from 'constate';
import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';
import {
    byggHenterRessurs,
    byggTomRessurs,
    hentDataFraRessurs,
    RessursStatus,
} from '@navikt/familie-typer';

import Miljø, { basePath } from '../Miljø';
import { LocaleRecordBlock, LocaleRecordString } from '../typer/common';
import { IKvittering } from '../typer/kvittering';
import { IMellomlagretKontantstøtte } from '../typer/mellomlager';
import { ISøkerRespons } from '../typer/person';
import { RouteEnum } from '../typer/routes';
import { ITekstinnhold } from '../typer/sanity/sanity';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { InnloggetStatus } from '../utils/autentisering';
import { mapBarnResponsTilBarn } from '../utils/barn';
import { preferredAxios } from './axios';
import { useInnloggetContext } from './InnloggetContext';
import { useLastRessurserContext } from './LastRessurserContext';
import { hentSluttbrukerFraPdl } from './pdl';
import { useSanity } from './SanityContext';

const [AppProvider, useApp] = createUseContext(() => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { axiosRequest, lasterRessurser } = useLastRessurserContext();
    const { innloggetStatus } = useInnloggetContext();
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<ISøkerRespons>());
    const [eøsLand, settEøsLand] = useState(byggTomRessurs<Map<Alpha3Code, string>>());
    const [søknad, settSøknad] = useState<ISøknad>(initialStateSøknad);
    const [innsendingStatus, settInnsendingStatus] = useState(byggTomRessurs<IKvittering>());
    const [sisteUtfylteStegIndex, settSisteUtfylteStegIndex] = useState<number>(-1);
    const [mellomlagretVerdi, settMellomlagretVerdi] = useState<IMellomlagretKontantstøtte>();
    const [fåttGyldigKvittering, settFåttGyldigKvittering] = useState(false);
    const [nåværendeRoute, settNåværendeRoute] = useState<RouteEnum | undefined>(undefined);
    const { modellVersjon } = Miljø();
    const [sisteModellVersjon, settSisteModellVersjon] = useState(modellVersjon);
    const modellVersjonOppdatert = sisteModellVersjon > modellVersjon;
    const { teksterRessurs } = useSanity();

    useEffect(() => {
        if (nåværendeRoute === RouteEnum.Kvittering) {
            return;
        } else {
            axiosRequest<number, void>({
                url: `${basePath}modellversjon`,
            }).then(data =>
                settSisteModellVersjon(prevState => hentDataFraRessurs(data) ?? prevState)
            );
        }
    }, [nåværendeRoute]);

    useEffect(() => {
        if (!søknad.søker.triggetEøs) {
            settSøknad({
                ...søknad,
                søker: {
                    ...søknad.søker,
                    adresseISøkeperiode: {
                        ...søknad.søker.adresseISøkeperiode,
                        svar: '',
                    },
                },
            });
        }
    }, [søknad.søker.triggetEøs]);

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            hentSluttbrukerFraPdl(axiosRequest).then(ressurs => {
                settSluttbruker(ressurs);

                hentOgSettMellomlagretData();
                ressurs.status === RessursStatus.SUKSESS &&
                    settSøknad({
                        ...søknad,
                        søker: {
                            ...søknad.søker,
                            navn: ressurs.data.navn,
                            statsborgerskap: ressurs.data.statsborgerskap,
                            barn: mapBarnResponsTilBarn(ressurs.data.barn, intl),
                            ident: ressurs.data.ident,
                            adresse: ressurs.data.adresse,
                            sivilstand: ressurs.data.sivilstand,
                            adressebeskyttelse: ressurs.data.adressebeskyttelse,
                        },
                    });
            });
        }
    }, [innloggetStatus]);

    const mellomlagre = () => {
        const kontantstøtte: IMellomlagretKontantstøtte = {
            søknad: søknad,
            modellVersjon: Miljø().modellVersjon,
            sisteUtfylteStegIndex: sisteUtfylteStegIndex,
            locale: valgtLocale,
        };
        axiosRequest<IMellomlagretKontantstøtte, IMellomlagretKontantstøtte>({
            url: Miljø().mellomlagerUrl,
            method: 'post',
            withCredentials: true,
            påvirkerSystemLaster: false,
            data: kontantstøtte,
        }).catch(() => {
            // do nothing
        });
        settMellomlagretVerdi(kontantstøtte);
    };

    useEffect(() => {
        if (sisteUtfylteStegIndex > 0) {
            mellomlagre();
        }
    }, [nåværendeRoute, søknad.dokumentasjon]);

    const hentOgSettMellomlagretData = () => {
        preferredAxios
            .get(Miljø().mellomlagerUrl, {
                withCredentials: true,
            })
            .then((response: { data?: IMellomlagretKontantstøtte }) => {
                if (response.data) {
                    settMellomlagretVerdi(response.data);
                }
            })
            .catch(() => {
                // Do nothing
            });
    };

    const brukMellomlagretVerdi = () => {
        if (mellomlagretVerdi) {
            settSøknad(mellomlagretVerdi.søknad);
            settSisteUtfylteStegIndex(mellomlagretVerdi.sisteUtfylteStegIndex);
        }
    };

    const nullstillMellomlagretVerdi = () => {
        axiosRequest<void, void>({
            url: Miljø().mellomlagerUrl,
            method: 'delete',
            withCredentials: true,
            påvirkerSystemLaster: false,
        });
        settMellomlagretVerdi(undefined);
    };

    const nullstillSøknadsobjekt = () => {
        const søker = søknad.søker;
        settSøknad({
            ...initialStateSøknad,
            søker: {
                ...initialStateSøknad.søker,
                ident: søker.ident,
                navn: søker.navn,
                barn: søker.barn,
                statsborgerskap: søker.statsborgerskap,
                adresse: søker.adresse,
                sivilstand: søker.sivilstand,
                adressebeskyttelse: søker.adressebeskyttelse,
            },
        });
    };

    const erStegUtfyltFrafør = (nåværendeStegIndex: number) =>
        sisteUtfylteStegIndex >= nåværendeStegIndex;

    const avbrytOgSlettSøknad = () => {
        nullstillSøknadsobjekt();
        nullstillMellomlagretVerdi();
        settSisteUtfylteStegIndex(-1);
    };

    const gåTilbakeTilStart = () => {
        nullstillSøknadsobjekt();
        settSisteUtfylteStegIndex(-1);
    };

    const systemetFeiler = () => {
        return (
            sluttbruker.status === RessursStatus.FEILET ||
            eøsLand.status === RessursStatus.FEILET ||
            teksterRessurs.status === RessursStatus.FEILET
        );
    };

    const systemetOK = () => {
        return (
            innloggetStatus === InnloggetStatus.AUTENTISERT &&
            sluttbruker.status === RessursStatus.SUKSESS &&
            eøsLand.status === RessursStatus.SUKSESS &&
            teksterRessurs.status === RessursStatus.SUKSESS
        );
    };

    const systemetLaster = (): boolean => {
        return lasterRessurser() || innloggetStatus === InnloggetStatus.IKKE_VERIFISERT;
    };

    const localeString = (key: LocaleRecordString): string => key[valgtLocale];

    const localeBlock = (key: LocaleRecordBlock): PortableTextBlock => key[valgtLocale];

    const tekster = (): ITekstinnhold => {
        if (teksterRessurs.status === RessursStatus.SUKSESS) {
            return teksterRessurs.data;
        } else {
            throw new Error(`Søknaden har lastet uten tekster`);
        }
    };

    return {
        axiosRequest,
        sluttbruker,
        søknad,
        settSøknad,
        nullstillSøknadsobjekt,
        innsendingStatus,
        settInnsendingStatus,
        sisteUtfylteStegIndex,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        avbrytOgSlettSøknad,
        gåTilbakeTilStart,
        brukMellomlagretVerdi,
        mellomlagretVerdi,
        fåttGyldigKvittering,
        settFåttGyldigKvittering,
        settNåværendeRoute,
        systemetFeiler,
        systemetOK,
        systemetLaster,
        mellomlagre,
        modellVersjonOppdatert,
        settSisteModellVersjon,
        eøsLand,
        settEøsLand,
        localeString,
        localeBlock,
        tekster,
    };
});

export { AppProvider, useApp };
