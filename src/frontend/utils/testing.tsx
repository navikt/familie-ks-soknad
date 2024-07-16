import React, { ReactNode } from 'react';

import { mockDeep } from 'jest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';

import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
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
import * as sanityContext from '../context/SanityContext';
import { SanityProvider } from '../context/SanityContext';
import { SpråkProvider } from '../context/SpråkContext';
import { StegProvider } from '../context/StegContext';
import { LocaleType } from '../typer/common';
import { EFeatureToggle } from '../typer/feature-toggles';
import { ESivilstand } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { ISøker, ISøkerRespons } from '../typer/person';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { initialStateSøknad } from '../typer/søknad';

jest.mock('../context/pdl');

export const spyOnUseApp = søknad => {
    jest.spyOn(pdlRequest, 'hentSluttbrukerFraPdl').mockImplementation(async () => ({
        status: RessursStatus.SUKSESS,
        data: mockDeep<ISøkerRespons>({ sivilstand: { type: ESivilstand.UGIFT }, ...søknad.søker }),
    }));
    const tekster = jest.fn().mockImplementation(() => mockDeep<ITekstinnhold>());
    const plainTekst = jest.fn();
    const tilRestLocaleRecord = jest.fn();
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
        plainTekst,
        tilRestLocaleRecord,
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

export const mockSanity = () => {
    const useSanity = jest.spyOn(sanityContext, 'useSanity').mockImplementation(
        jest.fn().mockReturnValue({
            teksterRessurs: RessursStatus.SUKSESS,
        })
    );
    return { useSanity };
};

export const mockFeatureToggle = () => {
    const useFeatureToggle = jest
        .spyOn(featureToggleContext, 'useFeatureToggles')
        .mockImplementation(
            jest.fn().mockReturnValue({
                toggles: {
                    [EFeatureToggle.VIS_GUIDE_I_STEG]: false,
                },
            })
        );
    return { useFeatureToggle };
};

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    children?: ReactNode
) => {
    const [Første, ...resten] = providerComponents;
    const erSpråkprovider = Første === SpråkProvider;
    return (
        <Første {...(erSpråkprovider ? { defaultLocale: LocaleType.nb } : {})}>
            {resten.length ? wrapMedProvidere(resten, children) : children}
        </Første>
    );
};

const wrapMedDefaultProvidere = (children: ReactNode) =>
    wrapMedProvidere(
        [
            SpråkProvider,
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
        children
    );

interface TestProviderProps {
    children?: ReactNode;
}
export function TestProvidere({ children }: TestProviderProps) {
    return wrapMedDefaultProvidere(children);
}

export const mockedHistory: string[] = [];

export const mockHistory = (newHistory: string[]) => {
    mockedHistory.push(...newHistory);
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
