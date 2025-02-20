import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Alpha3Code, getName } from 'i18n-iso-countries';

import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    hentDataFraRessurs,
    type Ressurs,
    RessursStatus,
} from '@navikt/familie-typer';

import Miljø, { basePath } from '../../shared-utils/Miljø';
import { LocaleType } from '../typer/common';
import { IKontoinformasjon } from '../typer/kontoinformasjon';
import { FlettefeltVerdier, PlainTekst, TilRestLocaleRecord } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { IMellomlagretKontantstøtte } from '../typer/mellomlager';
import { ISøkerRespons } from '../typer/person';
import { RouteEnum } from '../typer/routes';
import { ESanityFlettefeltverdi, ESanitySteg } from '../typer/sanity/sanity';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { InnloggetStatus } from '../utils/autentisering';
import { mapBarnResponsTilBarn } from '../utils/barn';
import { plainTekstHof } from '../utils/sanity';

import { preferredAxios } from './axios';
import { useInnloggetContext } from './InnloggetContext';
import { useLastRessurserContext } from './LastRessurserContext';
import { hentSluttbrukerFraPdl } from './pdl';
import { useSanity } from './SanityContext';
import { useSpråk } from './SpråkContext';

const [AppProvider, useApp] = createUseContext(() => {
    const { valgtLocale } = useSpråk();
    const { axiosRequest, lasterRessurser } = useLastRessurserContext();
    const { innloggetStatus } = useInnloggetContext();
    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<ISøkerRespons>());
    const [eøsLand, settEøsLand] = useState(byggTomRessurs<Map<Alpha3Code, string>>());
    const [kontoinformasjon, settKontoinformasjon] = useState(byggTomRessurs<IKontoinformasjon>());
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
        if (
            innloggetStatus === InnloggetStatus.AUTENTISERT &&
            teksterRessurs.status === RessursStatus.SUKSESS
        ) {
            settSluttbruker(byggHenterRessurs());

            hentSluttbrukerFraPdl(axiosRequest).then(ressurs => {
                settSluttbruker(ressurs);

                hentOgSettMellomlagretData();
                hentOgSettKontoinformasjon();
                if (ressurs.status === RessursStatus.SUKSESS) {
                    settSøknad({
                        ...søknad,
                        søker: {
                            ...søknad.søker,
                            navn: ressurs.data.navn,
                            statsborgerskap: ressurs.data.statsborgerskap,
                            barn: mapBarnResponsTilBarn(
                                ressurs.data.barn,
                                tekster().FELLES.frittståendeOrd,
                                plainTekst
                            ),
                            ident: ressurs.data.ident,
                            adresse: ressurs.data.adresse,
                            sivilstand: ressurs.data.sivilstand,
                            adressebeskyttelse: ressurs.data.adressebeskyttelse,
                        },
                    });
                }
            });
        }
    }, [innloggetStatus, teksterRessurs]);

    const mellomlagre = (søknadSomSkalLagres: ISøknad, nåværendeStegIndex: number) => {
        const kontantstøtte: IMellomlagretKontantstøtte = {
            søknad: søknadSomSkalLagres,
            modellVersjon: Miljø().modellVersjon,
            sisteUtfylteStegIndex: sisteUtfylteStegIndex,
            sistePåbegynteStegIndex: nåværendeStegIndex,
            locale: valgtLocale,
        };
        axiosRequest<IMellomlagretKontantstøtte, IMellomlagretKontantstøtte>({
            url: `${Miljø().dokumentProxyUrl}/soknad/kontantstotte`,
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
            mellomlagre(søknad, sisteUtfylteStegIndex);
        }
    }, [nåværendeRoute, søknad.dokumentasjon]);

    const hentOgSettMellomlagretData = () => {
        preferredAxios
            .get(`${Miljø().dokumentProxyUrl}/soknad/kontantstotte`, {
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
            url: `${Miljø().dokumentProxyUrl}/soknad/kontantstotte`,
            method: 'delete',
            withCredentials: true,
            påvirkerSystemLaster: false,
        });
        settMellomlagretVerdi(undefined);
    };

    const hentOgSettKontoinformasjon = () => {
        preferredAxios
            .get(`${Miljø().soknadApiProxyUrl}/kontoregister/hent-kontonr`, {
                withCredentials: true,
            })
            .then((response: { data?: Ressurs<IKontoinformasjon> }) => {
                if (response.data) {
                    settKontoinformasjon(response.data);
                }
            })
            .catch(() => {
                settKontoinformasjon(byggFeiletRessurs('Request mot kontoregisteret feilet'));
            });
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

    const tekster = (): ITekstinnhold => {
        if (teksterRessurs.status === RessursStatus.SUKSESS) {
            return teksterRessurs.data;
        } else {
            throw new Error(`Søknaden har lastet uten tekster`);
        }
    };

    const flettefeltTilTekst = (
        sanityFlettefelt: ESanityFlettefeltverdi,
        flettefelter?: FlettefeltVerdier,
        spesifikkLocale?: LocaleType
    ): string => {
        const frittståendeOrd = tekster()[ESanitySteg.FELLES].frittståendeOrd;
        switch (sanityFlettefelt) {
            case ESanityFlettefeltverdi.DATO:
                if (!flettefelter?.dato) {
                    throw Error('Flettefeltet dato ikke sendt med');
                }
                return flettefelter.dato;
            case ESanityFlettefeltverdi.KLOKKESLETT:
                if (!flettefelter?.klokkeslett) {
                    throw Error('Flettefeltet klokkeslett ikke sendt med');
                }
                return flettefelter.klokkeslett;
            case ESanityFlettefeltverdi.ANTALL:
                if (!flettefelter?.antall) {
                    throw Error('Flettefeltet antall ikke sendt med');
                }
                return flettefelter.antall;
            case ESanityFlettefeltverdi.TOTAL_ANTALL:
                if (!flettefelter?.totalAntall) {
                    throw Error('Flettefeltet totalAntall ikke sendt med');
                }
                return flettefelter.totalAntall;
            case ESanityFlettefeltverdi.SØKER_NAVN:
                return søknad.søker.navn;
            case ESanityFlettefeltverdi.BARN_NAVN:
                if (!flettefelter?.barnetsNavn) {
                    throw Error('Flettefeltet barnetsNavn ikke sendt med');
                }
                return flettefelter.barnetsNavn;
            case ESanityFlettefeltverdi.YTELSE:
                return plainTekst(
                    frittståendeOrd.kontantstoette,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
            case ESanityFlettefeltverdi.YTELSE_BESTEMT_FORM:
                return plainTekst(
                    frittståendeOrd.kontantstoetten,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
            case ESanityFlettefeltverdi.I_UTENFOR:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utenfor : frittståendeOrd.i,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
            case ESanityFlettefeltverdi.UTLANDET_NORGE:
                return plainTekst(
                    flettefelter?.gjelderUtland ? frittståendeOrd.utlandet : frittståendeOrd.norge,
                    undefined,
                    spesifikkLocale ?? valgtLocale
                );
            case ESanityFlettefeltverdi.LAND:
                if (!flettefelter?.land) {
                    throw Error('Flettefeltet land ikke sendt med');
                }
                return (
                    getName(flettefelter.land, spesifikkLocale ?? valgtLocale) ?? flettefelter.land
                );
        }
    };

    const plainTekst: PlainTekst = plainTekstHof(flettefeltTilTekst, valgtLocale);

    const tilRestLocaleRecord: TilRestLocaleRecord = (
        sanityTekst,
        flettefelter
    ): Record<LocaleType, string> => {
        return {
            [LocaleType.en]: plainTekst(sanityTekst, flettefelter, LocaleType.en),
            [LocaleType.nn]: plainTekst(sanityTekst, flettefelter, LocaleType.nn),
            [LocaleType.nb]: plainTekst(sanityTekst, flettefelter, LocaleType.nb),
        };
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
        tekster,
        flettefeltTilTekst,
        plainTekst,
        tilRestLocaleRecord,
        kontoinformasjon,
    };
});

export { AppProvider, useApp };
