import React, { PropsWithChildren, ReactNode } from 'react';

import { Cookies, CookiesProvider } from 'react-cookie';
import { MemoryRouter } from 'react-router';
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
import { FeatureTogglesProvider } from '../context/FeatureTogglesContext';
import { InnloggetProvider } from '../context/InnloggetContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import { RoutesProvider } from '../context/RoutesContext';
import { SanityProvider } from '../context/SanityContext';
import { SpråkProvider } from '../context/SpråkContext';
import { StegProvider } from '../context/StegContext';
import { ESivilstand } from '../typer/kontrakt/generelle';
import { IKvittering } from '../typer/kvittering';
import { IUtenlandsperiode } from '../typer/perioder';
import { ISøker } from '../typer/person';
import { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { initialStateSøknad } from '../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../typer/utenlandsopphold';

export const spyOnUseApp = søknad => {
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

export function CookiesProviderMedLocale(props: PropsWithChildren) {
    const cookies = new Cookies();
    cookies.set('decorator-language', 'nb');

    return <CookiesProvider cookies={cookies}>{props.children}</CookiesProvider>;
}

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

export const wrapMedProvidere = (
    // eslint-disable-next-line
    providerComponents: React.FC<any>[],
    children?: ReactNode
) => {
    const [Første, ...resten] = providerComponents;
    return <Første>{resten.length ? wrapMedProvidere(resten, children) : children}</Første>;
};

interface TestProviderProps {
    children?: ReactNode;
    mocketNettleserHistorikk?: string[];
}
export function TestProvidere({ children, mocketNettleserHistorikk }: TestProviderProps) {
    const MemoryRouterMedHistorikk = (props: PropsWithChildren) => (
        <MemoryRouter initialEntries={mocketNettleserHistorikk}>{props.children}</MemoryRouter>
    );
    return wrapMedProvidere(
        [
            CookiesProviderMedLocale,
            SpråkProvider,
            HttpProvider,
            LastRessurserProvider,
            SanityProvider,
            InnloggetProvider,
            FeatureTogglesProvider,
            AppProvider,
            EøsProvider,
            RoutesProvider,
            MemoryRouterMedHistorikk,
            StegProvider,
            AppNavigationProvider,
        ],
        children
    );
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
