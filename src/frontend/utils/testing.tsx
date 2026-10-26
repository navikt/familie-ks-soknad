import { ESvar } from '@navikt/familie-form-elements';
import { HttpProvider } from '@navikt/familie-http';
import { type Ressurs, RessursStatus } from '@navikt/familie-typer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { within } from '@testing-library/react';

import type { PropsWithChildren, ReactNode } from 'react';
import { Cookies, CookiesProvider } from 'react-cookie';
import { MemoryRouter } from 'react-router';
import { type Mock, type MockInstance, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { ESivilstand } from '../../common/typer/kontrakt/generelle';
import { LocaleType } from '../../common/typer/locale';
import { UtenlandsoppholdSpørsmålId } from '../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import * as appContext from '../context/AppContext';
import { AppProvider } from '../context/AppContext';
import { AppNavigationProvider } from '../context/AppNavigationContext';
import * as eøsContext from '../context/EøsContext';
import { EøsProvider } from '../context/EøsContext';
import { FeatureTogglesProvider } from '../context/FeatureTogglesContext';
import { LastRessurserProvider } from '../context/LastRessurserContext';
import { SanityProvider } from '../context/SanityContext';
import { SpråkProvider } from '../context/SpråkContext';
import { StegProvider } from '../context/StegContext';
import type { IKvittering } from '../typer/kvittering';
import type { IUtenlandsperiode } from '../typer/perioder';
import type { ISøker } from '../typer/person';
import type { ESanityFlettefeltverdi } from '../typer/sanity/sanity';
import type { ITekstinnhold } from '../typer/sanity/tekstInnhold';
import { type ISøknad, initialStateSøknad } from '../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../typer/utenlandsopphold';

import { plainTekstHof } from './sanity';

interface SpyOnUseAppResult {
    useAppMock: Mock;
    tekster: Mock;
    settSøknad: Mock;
    erStegUtfyltFrafør: Mock;
    settSisteUtfylteStegIndex: Mock;
    erPåKvitteringsside: Mock;
    axiosRequestMock: Mock;
    søknad: ISøknad;
}

interface MockEøsResult {
    useEøs: MockInstance;
    erEøsLand: Mock;
}

const flettefeltTilTekstStub = (flettefeltVerdi: ESanityFlettefeltverdi): string => `[${flettefeltVerdi}]`;

const språk = ['nb', 'nn', 'en'] as const;

const lagBlokk = (tekst: string) => [
    {
        _type: 'block',
        _key: tekst,
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: `${tekst}-span`, text: tekst, marks: [] }],
    },
];

/**
 * Lager mock-tekster fra Sanity der hver tekst er lik nøkkelstien, f.eks. `OM_DEG.navn`.
 * Både `plainTekst` og `TekstBlock` leser `tekst[locale]`, og får da en blokk med nøkkelstien.
 * `overstyringer` lar en test gi en nøkkelsti egen verdi, f.eks. en blokk med flettefelt.
 */
export const lagTekstProxy = (overstyringer: Record<string, unknown> = {}): ITekstinnhold => {
    const buffer = new Map<string, unknown>();

    const lag = (sti: string[]): unknown => {
        const stiTekst = sti.join('.');
        if (stiTekst in overstyringer) {
            return overstyringer[stiTekst];
        }
        const bufret = buffer.get(stiTekst);
        if (bufret) {
            return bufret;
        }
        const proxy = new Proxy(
            {},
            {
                get: (_, nøkkel) => {
                    // Unngå at objektet tolkes som promise, React-element eller serialiseres
                    if (typeof nøkkel === 'symbol' || ['then', 'toJSON', '$$typeof'].includes(nøkkel)) {
                        return undefined;
                    }
                    if ((språk as readonly string[]).includes(nøkkel)) {
                        return lagBlokk(stiTekst);
                    }
                    if (nøkkel === 'api_navn') {
                        return stiTekst;
                    }
                    return lag([...sti, nøkkel]);
                },
            }
        );
        buffer.set(stiTekst, proxy);
        return proxy;
    };

    return lag([]) as ITekstinnhold;
};

const escapeRegExp = (tekst: string) => tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const spørsmålNavn = (sti: string) => new RegExp(`^${escapeRegExp(sti)}`);

export const hentSpørsmål = (sti: string, container: HTMLElement = document.body): HTMLElement =>
    within(container).getByRole('radiogroup', { name: spørsmålNavn(sti) });

export const ventPåSpørsmål = (sti: string, container: HTMLElement = document.body): Promise<HTMLElement> =>
    within(container).findByRole('radiogroup', { name: spørsmålNavn(sti) });

export const spørsmålFinnes = (sti: string, container: HTMLElement = document.body): boolean =>
    within(container).queryByRole('radiogroup', { name: spørsmålNavn(sti) }) !== null;

export const hentSvaralternativ = (spørsmål: HTMLElement, svar: 'ja' | 'nei' | 'jegVetIkke'): HTMLElement =>
    within(spørsmål).getByRole('radio', { name: `FELLES.frittståendeOrd.${svar}` });

export const spyOnUseApp = (søknad): SpyOnUseAppResult => {
    const tekstInnhold = lagTekstProxy();
    const tekster = vi.fn().mockImplementation(() => tekstInnhold);
    const plainTekst = vi.fn(plainTekstHof(flettefeltTilTekstStub, LocaleType.nb));
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
            (): Promise<Ressurs<unknown>> => Promise.resolve({ status: RessursStatus.SUKSESS, data: {} })
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
        tekster,
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

export function mockEøs(barnSomTriggerEøs = [], søkerTriggerEøs = false): MockEøsResult {
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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

interface TestProviderProps {
    children?: ReactNode;
    mocketNettleserHistorikk?: string[];
}
export function TestProvidere({ children, mocketNettleserHistorikk }: TestProviderProps) {
    return (
        <CookiesProviderMedLocale>
            <SpråkProvider>
                <HttpProvider>
                    <LastRessurserProvider>
                        <QueryClientProvider client={queryClient}>
                            <FeatureTogglesProvider>
                                <SanityProvider tekster={mockDeep<ITekstinnhold>()}>
                                    <AppProvider>
                                        <EøsProvider>
                                            <MemoryRouter initialEntries={mocketNettleserHistorikk}>
                                                <StegProvider>
                                                    <AppNavigationProvider>{children}</AppNavigationProvider>
                                                </StegProvider>
                                            </MemoryRouter>
                                        </EøsProvider>
                                    </AppProvider>
                                </SanityProvider>
                            </FeatureTogglesProvider>
                        </QueryClientProvider>
                    </LastRessurserProvider>
                </HttpProvider>
            </SpråkProvider>
        </CookiesProviderMedLocale>
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
