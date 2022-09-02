import React, { ReactNode } from 'react';

import * as history from 'history';
import { History } from 'history';
import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import norskeTekster from '../assets/lang/nb.json' assert { type: 'json' };
import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import * as appContext from '../context/AppContext';
import { AppProvider } from '../context/AppContext';
import { AppNavigationProvider } from '../context/AppNavigationContext';
import * as eøsContext from '../context/EøsContext';
import { EøsProvider } from '../context/EøsContext';
import * as featureToggleContext from '../context/FeatureToggleContext';
import { FeatureTogglesProvider } from '../context/FeatureToggleContext';
import { InnloggetProvider } from '../context/InnloggetContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import * as pdlRequest from '../context/pdl';
import * as routesContext from '../context/RoutesContext';
import { getRoutes, RoutesProvider } from '../context/RoutesContext';
import { SanityProvider } from '../context/SanityContext';
import { StegProvider } from '../context/StegContext';
import { andreForelderDataKeySpørsmål, barnDataKeySpørsmål } from '../typer/barn';
import { AlternativtSvarForInput } from '../typer/common';
import { ESivilstand } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { ISøker, ISøkerRespons } from '../typer/person';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { initialStateSøknad, ISøknad } from '../typer/søknad';
import { genererInitialBarnMedISøknad } from './barn';

jest.mock('../context/pdl');

jest.mock('@sanity/client', () => {
    return function sanity() {
        return {
            fetch: () => ({
                then: () => ({
                    catch: jest.fn(),
                }),
            }),
        };
    };
});

export const spyOnUseApp = søknad => {
    jest.spyOn(pdlRequest, 'hentSluttbrukerFraPdl').mockImplementation(async () => ({
        status: RessursStatus.SUKSESS,
        data: mockDeep<ISøkerRespons>({ sivilstand: { type: ESivilstand.UGIFT }, ...søknad.søker }),
    }));
    const tekster = jest.fn().mockImplementation(() => mockDeep<ITekstinnhold>());
    const localeString = jest.fn();
    const localeBlock = jest.fn();
    const settSøknad = jest.fn();
    const erPåKvitteringsside = jest.fn().mockImplementation(() => false);
    const erStegUtfyltFrafør = jest.fn().mockImplementation(() => true);
    const settSisteUtfylteStegIndex = jest.fn();
    const innsendingStatus = mockDeep<Ressurs<IKvittering>>({
        status: RessursStatus.IKKE_HENTET,
    });
    const settInnsendingStatus = jest.fn();
    const axiosRequestMock = jest
        .fn()
        .mockImplementation(
            (): Promise<Ressurs<unknown>> =>
                Promise.resolve({ status: RessursStatus.SUKSESS, data: {} })
        );
    const settNåværendeRoute = jest.fn();
    const mellomlagre = jest.fn();
    const sluttbruker = { status: RessursStatus.SUKSESS, data: { navn: '' } };

    søknad.barnInkludertISøknaden = søknad.barnInkludertISøknaden ?? [];
    søknad.erEøs = søknad.erEøs ?? false;
    søknad.søker = {
        ...mekkGyldigSøker(),
        ...søknad.søker,
    };
    søknad.dokumentasjon = søknad.dokumentasjon ?? [];

    const settEøsLand = jest.fn();
    const eøsLand = { status: RessursStatus.SUKSESS, data: ['BEL', 'AFG', 'NLD', 'NOR'] };

    const useAppMock = jest.fn().mockReturnValue({
        søknad,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        settSøknad,
        sisteUtfylteStegIndex: 2,
        erPåKvitteringsside,
        innsendingStatus,
        settInnsendingStatus,
        axiosRequest: axiosRequestMock,
        settNåværendeRoute,
        mellomlagre,
        sluttbruker,
        settEøsLand,
        eøsLand,
        systemetLaster: jest.fn().mockReturnValue(false),
        systemetOK: () => jest.fn().mockReturnValue(true),
        systemetFeiler: jest.fn().mockReturnValue(false),
        tekster,
        localeString,
        localeBlock,
    });
    jest.spyOn(appContext, 'useApp').mockImplementation(useAppMock);

    return {
        useAppMock,
        settSøknad,
        erStegUtfyltFrafør,
        settSisteUtfylteStegIndex,
        erPåKvitteringsside,
        axiosRequestMock,
        søknad,
    };
};

export const mockEøs = (barnSomTriggerEøs = [], søkerTriggerEøs = false) => {
    const erEøsLand = jest.fn();

    const useEøs = jest.spyOn(eøsContext, 'useEøs').mockImplementation(
        jest.fn().mockReturnValue({
            erEøsLand,
            barnSomTriggerEøs,
            settBarnSomTriggerEøs: jest.fn(),
            settSøkerTriggerEøs: jest.fn(),
            skalTriggeEøsForBarn: jest.fn().mockReturnValue(false),
            skalTriggeEøsForSøker: jest.fn().mockReturnValue(false),
            søkerTriggerEøs,
        })
    );
    return { useEøs, erEøsLand };
};

export const mockRoutes = () => {
    const useRoutes = jest.spyOn(routesContext, 'useRoutes').mockImplementation(
        jest.fn().mockReturnValue({
            routes: getRoutes(),
            hentRouteObjektForRouteEnum: jest.fn(),
        })
    );
    return { useRoutes };
};

export const mockFeatureToggle = () => {
    const useFeatureToggle = jest
        .spyOn(featureToggleContext, 'useFeatureToggles')
        .mockImplementation(
            jest.fn().mockReturnValue({
                // toggles: { [EFeatureToggle.EXAMPLE]: false },
            })
        );
    return { useFeatureToggle };
};

/**
 * Åpen for norsk oversettelse av funksjonsnavn
 * Denne fjerner alle console errors fra jest-output. Ikke bruk før du veit at det kun er
 * oversettelsesfeil igjen. Mulig vi heller burde mocke noe i intl.
 */
export const silenceConsoleErrors = () => {
    return jest.spyOn(global.console, 'error').mockImplementation(() => {
        // Shut up about the missing translations;
    });
};

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    children?: ReactNode,
    språkTekster?: Record<string, string>
) => {
    const [Første, ...resten] = providerComponents;
    const erSpråkprovider = Første === SprakProvider;
    return (
        <Første
            {...(erSpråkprovider
                ? { tekster: { [LocaleType.nb]: språkTekster }, defaultLocale: LocaleType.nb }
                : {})}
        >
            {resten.length ? wrapMedProvidere(resten, children) : children}
        </Første>
    );
};

const wrapMedDefaultProvidere = (children: ReactNode, språkTekster: Record<string, string>) =>
    wrapMedProvidere(
        [
            SprakProvider,
            HttpProvider,
            LastRessurserProvider,
            SanityProvider,
            InnloggetProvider,
            FeatureTogglesProvider,
            AppProvider,
            EøsProvider,
            RoutesProvider,
            StegProvider,
            AppNavigationProvider,
        ],
        children,
        språkTekster
    );

export const TestProvidere: React.FC<{ tekster?: Record<string, string> }> = ({
    tekster,
    children,
}) => wrapMedDefaultProvidere(children, tekster ?? {});

export const TestProvidereMedEkteTekster: React.FC = ({ children }) => (
    <TestProvidere tekster={norskeTekster}>{children}</TestProvidere>
);

export const mockHistory = (
    newHistory: string[]
): { mockedHistory: History; mockedHistoryArray: string[] } => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore denne har vi definert i __mocks__/history
    return history.__setHistory(newHistory);
};

export const mekkGyldigSøker = (): ISøker => {
    return {
        ...initialStateSøknad.søker,
        sivilstand: { type: ESivilstand.UGIFT },
        utenlandsperioder: [],
        borPåRegistrertAdresse: {
            id: OmDegSpørsmålId.borPåRegistrertAdresse,
            svar: ESvar.JA,
        },
        værtINorgeITolvMåneder: {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: ESvar.JA,
        },
        planleggerÅBoINorgeTolvMnd: {
            id: OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd,
            svar: null,
        },
        yrkesaktivFemÅr: {
            id: OmDegSpørsmålId.yrkesaktivFemÅr,
            svar: ESvar.JA,
        },
        erAsylsøker: {
            id: DinLivssituasjonSpørsmålId.erAsylsøker,
            svar: ESvar.NEI,
        },
        arbeidIUtlandet: {
            id: DinLivssituasjonSpørsmålId.arbeidIUtlandet,
            svar: ESvar.NEI,
        },
        mottarUtenlandspensjon: {
            id: DinLivssituasjonSpørsmålId.mottarUtenlandspensjon,
            svar: ESvar.NEI,
        },
    };
};

export const mekkGyldigSøknad = (): ISøknad => {
    return {
        ...initialStateSøknad,
        lestOgForståttBekreftelse: true,
        søker: mekkGyldigSøker(),
        erNoenAvBarnaFosterbarn: {
            id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
            svar: ESvar.NEI,
        },
        oppholderBarnSegIInstitusjon: {
            id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
            svar: ESvar.NEI,
        },
        erBarnAdoptertFraUtland: {
            id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
            svar: ESvar.NEI,
        },
        søktAsylForBarn: {
            id: OmBarnaDineSpørsmålId.søktAsylForBarn,
            svar: ESvar.NEI,
        },
        mottarKontantstøtteForBarnFraAnnetEøsland: {
            id: OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland,
            svar: ESvar.NEI,
        },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
            svar: ESvar.JA,
        },
        harEllerTildeltBarnehageplass: {
            id: OmBarnaDineSpørsmålId.harEllerTildeltBarnehageplass,
            svar: ESvar.NEI,
        },
        barnInkludertISøknaden: [
            {
                ...genererInitialBarnMedISøknad({
                    id: 'random-id',
                    ident: '1234',
                    navn: 'Datter Dattersdottir',
                    adressebeskyttelse: false,
                    alder: null,
                    borMedSøker: true,
                }),
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        id: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
                        svar: ESvar.NEI,
                    },
                    adresse: {
                        id: EøsBarnSpørsmålId.andreForelderAdresse,
                        svar: 'Heisannveien 15',
                    },
                    andreUtbetalingsperioder: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderUtland: [],
                    pensjonsperioderNorge: [],
                    idNummer: [],
                    eøsKontantstøttePerioder: [],
                    [andreForelderDataKeySpørsmål.kontantstøtteFraEøs]: {
                        id: EøsBarnSpørsmålId.andreForelderKontantstøtte,
                        svar: ESvar.JA,
                    },
                    [andreForelderDataKeySpørsmål.navn]: {
                        id: OmBarnetSpørsmålsId.andreForelderNavn,
                        svar: 'Andre forelder navn',
                    },
                    [andreForelderDataKeySpørsmål.fnr]: {
                        id: OmBarnetSpørsmålsId.andreForelderFnr,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    [andreForelderDataKeySpørsmål.fødselsdato]: {
                        id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
                        svar: AlternativtSvarForInput.UKJENT,
                    },
                    [andreForelderDataKeySpørsmål.yrkesaktivFemÅr]: {
                        id: OmBarnetSpørsmålsId.andreForelderYrkesaktivFemÅr,
                        svar: ESvar.JA,
                    },
                    [andreForelderDataKeySpørsmål.arbeidUtlandet]: {
                        id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pensjonUtland]: {
                        id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pensjonNorge]: {
                        id: EøsBarnSpørsmålId.andreForelderPensjonNorge,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.arbeidNorge]: {
                        id: EøsBarnSpørsmålId.andreForelderArbeidNorge,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.andreUtbetalinger]: {
                        id: EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
                        id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
                        id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
                        svar: ESvar.NEI,
                    },
                    [andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
                        id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
                        svar: '',
                    },
                },
                omsorgsperson: null,
                [barnDataKeySpørsmål.borFastMedSøker]: {
                    id: OmBarnetSpørsmålsId.borFastMedSøker,
                    svar: ESvar.JA,
                },
                [barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte]: {
                    id: OmBarnetSpørsmålsId.mottarEllerMottokEøsKontantstøtte,
                    svar: ESvar.NEI,
                },
                eøsKontantstøttePerioder: [],
                [barnDataKeySpørsmål.adresse]: {
                    id: EøsBarnSpørsmålId.barnetsAdresse,
                    svar: '',
                },
            },
        ],
    };
};
