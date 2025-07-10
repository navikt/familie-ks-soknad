import React, { ReactNode } from 'react';

import { CookiesProvider } from 'react-cookie';
import { vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { type Ressurs, RessursStatus } from '@navikt/familie-typer';

import { UtenlandsoppholdSpørsmålId } from '../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import * as appContext from '../context/AppContext';
import { AppProvider } from '../context/AppContext';
import { AppNavigationProvider } from '../context/AppNavigationContext';
import * as eøsContext from '../context/EøsContext';
import { EøsProvider } from '../context/EøsContext';
import * as featureToggleContext from '../context/FeatureTogglesContext';
import { FeatureTogglesProvider } from '../context/FeatureTogglesContext';
import { InnloggetProvider } from '../context/InnloggetContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import * as pdlRequest from '../context/pdl';
import * as routesContext from '../context/RoutesContext';
import { getRoutes, RoutesProvider } from '../context/RoutesContext';
import * as sanityContext from '../context/SanityContext';
import { SanityProvider } from '../context/SanityContext';
import { SpråkProvider } from '../context/SpråkContext';
import { StegProvider } from '../context/StegContext';
import { EFeatureToggle } from '../typer/feature-toggles';
import { ESivilstand } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { IUtenlandsperiode } from '../typer/perioder';
import { ISøker, ISøkerRespons } from '../typer/person';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { initialStateSøknad } from '../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../typer/utenlandsopphold';

vi.mock('../context/pdl');

export const spyOnUseApp = søknad => {
    vi.spyOn(pdlRequest, 'hentSluttbrukerFraPdl').mockImplementation(async () => ({
        status: RessursStatus.SUKSESS,
        data: mockDeep<ISøkerRespons>({ sivilstand: { type: ESivilstand.UGIFT }, ...søknad.søker }),
    }));
    const tekster = vi.fn().mockImplementation(() => mockDeep<ITekstinnhold>());
    const plainTekst = vi.fn();
    const tilRestLocaleRecord = vi.fn();
    const settSøknad = vi.fn();
    const erPåKvitteringsside = vi.fn().mockImplementation(() => false);
    const erStegUtfyltFrafør = vi.fn().mockImplementation(() => true);
    const settSisteUtfylteStegIndex = vi.fn();
    const innsendingStatus = mockDeep<Ressurs<IKvittering>>({
        status: RessursStatus.IKKE_HENTET,
    });
    const settInnsendingStatus = vi.fn();
    const axiosRequestMock = vi
        .fn()
        .mockImplementation(
            (): Promise<Ressurs<unknown>> =>
                Promise.resolve({ status: RessursStatus.SUKSESS, data: {} })
        );
    const settNåværendeRoute = vi.fn();
    const mellomlagre = vi.fn();
    const sluttbruker = { status: RessursStatus.SUKSESS, data: { navn: '' } };

    søknad.barnInkludertISøknaden = søknad.barnInkludertISøknaden ?? [];
    søknad.erEøs = søknad.erEøs ?? false;
    søknad.søker = {
        ...mekkGyldigSøker(),
        ...søknad.søker,
    };
    søknad.dokumentasjon = søknad.dokumentasjon ?? [];

    const settEøsLand = vi.fn();
    const eøsLand = { status: RessursStatus.SUKSESS, data: ['BEL', 'AFG', 'NLD', 'NOR'] };

    const useAppMock = vi.fn().mockReturnValue({
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
        relevateDokumentasjoner: [],
        systemetLaster: vi.fn().mockReturnValue(false),
        systemetOK: () => vi.fn().mockReturnValue(true),
        systemetFeiler: vi.fn().mockReturnValue(false),
        tekster,
        plainTekst,
        tilRestLocaleRecord,
    });
    vi.spyOn(appContext, 'useAppContext').mockImplementation(useAppMock);

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

export function mockEøs(barnSomTriggerEøs = [], søkerTriggerEøs = false) {
    const erEøsLand = vi.fn();

    const useEøs = vi.spyOn(eøsContext, 'useEøsContext').mockImplementation(
        vi.fn().mockReturnValue({
            erEøsLand,
            barnSomTriggerEøs,
            settBarnSomTriggerEøs: vi.fn(),
            settSøkerTriggerEøs: vi.fn(),
            skalTriggeEøsForBarn: vi.fn().mockReturnValue(false),
            skalTriggeEøsForSøker: vi.fn().mockReturnValue(false),
            søkerTriggerEøs,
        })
    );
    return { useEøs, erEøsLand };
}

export function mockRoutes() {
    const useRoutes = vi.spyOn(routesContext, 'useRoutesContext').mockImplementation(
        vi.fn().mockReturnValue({
            routes: getRoutes(),
            hentRouteObjektForRouteEnum: vi.fn(),
        })
    );
    return { useRoutes };
}

export function mockSanity() {
    const useSanity = vi.spyOn(sanityContext, 'useSanityContext').mockImplementation(
        vi.fn().mockReturnValue({
            teksterRessurs: RessursStatus.SUKSESS,
        })
    );
    return { useSanity };
}

export function mockFeatureToggle() {
    const useFeatureToggle = vi.spyOn(featureToggleContext, 'useFeatureToggles').mockImplementation(
        vi.fn().mockReturnValue({
            // toggles: { [EFeatureToggle.EXAMPLE]: false },
            toggles: {
                [EFeatureToggle.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP]: false,
            },
        })
    );
    return { useFeatureToggle };
}

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    children?: ReactNode
) => {
    const [Første, ...resten] = providerComponents;
    return <Første>{resten.length ? wrapMedProvidere(resten, children) : children}</Første>;
};

const wrapMedDefaultProvidere = (children: ReactNode) =>
    wrapMedProvidere(
        [
            CookiesProvider,
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

export function mekkGyldigUtenlandsoppholdEøs(): IUtenlandsperiode {
    return {
        utenlandsoppholdÅrsak: {
            id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
            svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        },
        oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'BEL' },
        oppholdslandFraDato: {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        oppholdslandTilDato: {
            id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
            svar: '',
        },
        adresse: { id: UtenlandsoppholdSpørsmålId.adresse, svar: '' },
    };
}

export function mekkGyldigUtenlandsoppholdIkkeEøs(): IUtenlandsperiode {
    return {
        utenlandsoppholdÅrsak: {
            id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
            svar: EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE,
        },
        oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: 'USA' },
        oppholdslandFraDato: {
            id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
            svar: '',
        },
        oppholdslandTilDato: {
            id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
            svar: '',
        },
        adresse: { id: UtenlandsoppholdSpørsmålId.adresse, svar: '' },
    };
}
