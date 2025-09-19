import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { byggHenterRessurs, hentDataFraRessurs } from '@navikt/familie-typer';

import miljø from '../../shared-utils/miljø';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../typer/barn';
import { BarnetsId } from '../typer/common';
import { ISøker } from '../typer/person';

import { useAppContext } from './AppContext';
import { useLastRessurserContext } from './LastRessurserContext';

export interface EøsContext {
    erEøsLand: (land: Alpha3Code | '') => boolean;
    skalTriggeEøsForSøker: (søker: ISøker) => boolean;
    skalTriggeEøsForBarn: (barn: IBarnMedISøknad) => boolean;
    settSøkerTriggerEøs: React.Dispatch<React.SetStateAction<boolean>>;
    settBarnSomTriggerEøs: React.Dispatch<React.SetStateAction<string[]>>;
    søkerTriggerEøs: boolean;
    barnSomTriggerEøs: BarnetsId[];
    erEøsTrigget: () => number | true;
}

const EøsContext = createContext<EøsContext | undefined>(undefined);

export function EøsProvider(props: PropsWithChildren) {
    const { axiosRequest } = useLastRessurserContext();

    const { søknad, settSøknad, eøsLand, settEøsLand } = useAppContext();
    const [søkerTriggerEøs, settSøkerTriggerEøs] = useState(søknad.søker.triggetEøs);
    const [barnSomTriggerEøs, settBarnSomTriggerEøs] = useState<BarnetsId[]>(
        søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs).map(barn => barn.id)
    );

    const { soknadApiProxyUrl } = miljø();

    useEffect(() => {
        settEøsLand(byggHenterRessurs());
        (async () => {
            try {
                const eøsLandResponse = await axiosRequest<Map<Alpha3Code, string>, void>({
                    url: `${soknadApiProxyUrl}/kodeverk/eos-land`,
                    method: 'GET',
                    påvirkerSystemLaster: true,
                });

                settEøsLand(eøsLandResponse);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                // do nothing
            }
        })();
    }, []);

    const erEøsLand = (land: Alpha3Code | ''): boolean => {
        const eøsLandData = hentDataFraRessurs(eøsLand);

        if (!eøsLandData) {
            return false;
        }
        const eøsLandListe = Object.keys(eøsLandData) as Alpha3Code[];
        return !!(land && eøsLandListe?.includes(land));
    };

    const skalTriggeEøsForSøker = (søker: ISøker): boolean => {
        const landSvarSomKanTrigge = [
            søker.utenlandsperioder.map(periode => periode.oppholdsland.svar),
            søker.arbeidsperioderUtland.map(periode => periode.arbeidsperiodeland.svar),
            søker.pensjonsperioderUtland.map(periode => periode.pensjonsland.svar),
        ].flat();

        return !!landSvarSomKanTrigge.find(land => erEøsLand(land));
    };

    const skalTriggeEøsForBarn = (barn: IBarnMedISøknad): boolean => {
        const landSvarSomKanTriggeEøs = [
            ...(barn.andreForelder
                ? [
                      barn.andreForelder.arbeidsperioderUtland.map(periode => periode.arbeidsperiodeland.svar),
                      barn.andreForelder.pensjonsperioderUtland.map(periode => periode.pensjonsland.svar),
                      barn.andreForelder.utenlandsperioder.map(periode => periode.oppholdsland.svar),
                  ]
                : []),
            barn.utenlandsperioder.map(periode => periode.oppholdsland.svar),
        ].flat();

        const jaNeiSvarSomKanTriggeEøs = barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA;

        return !!landSvarSomKanTriggeEøs.find(land => erEøsLand(land)) || jaNeiSvarSomKanTriggeEøs;
    };

    useEffect(() => {
        const eøsTriggetForSøker = skalTriggeEøsForSøker(søknad.søker);

        const eøsTriggetForBarn = !!søknad.barnInkludertISøknaden.find(barn => skalTriggeEøsForBarn(barn));

        const erEøs = eøsTriggetForSøker || eøsTriggetForBarn;

        if (erEøs !== søknad.erEøs) {
            settSøknad({
                ...søknad,
                erEøs,
            });
        }
    }, [søknad.søker, søknad.barnInkludertISøknaden]);

    const erEøsTrigget = () => søkerTriggerEøs || barnSomTriggerEøs.length;

    return (
        <EøsContext.Provider
            value={{
                erEøsLand,
                skalTriggeEøsForSøker,
                skalTriggeEøsForBarn,
                settSøkerTriggerEøs,
                settBarnSomTriggerEøs,
                søkerTriggerEøs,
                barnSomTriggerEøs,
                erEøsTrigget,
            }}
        >
            {props.children}
        </EøsContext.Provider>
    );
}

export function useEøsContext() {
    const context = useContext(EøsContext);

    if (context === undefined) {
        throw new Error('useEøsContext må brukes innenfor EøsProvider');
    }

    return context;
}
