import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { byggHenterRessurs, hentDataFraRessurs } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../typer/barn';
import { BarnetsId } from '../typer/common';
import { ISøker } from '../typer/person';
import { useApp } from './AppContext';
import { useLastRessurserContext } from './LastRessurserContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();

    const { søknad, settSøknad, eøsLand, settEøsLand } = useApp();
    const [søkerTriggerEøs, settSøkerTriggerEøs] = useState(søknad.søker.triggetEøs);
    const [barnSomTriggerEøs, settBarnSomTriggerEøs] = useState<BarnetsId[]>(
        søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs).map(barn => barn.id)
    );

    const { soknadApi } = Miljø();

    useEffect(() => {
        settEøsLand(byggHenterRessurs());
        (async () => {
            try {
                const eøsLandResponse = await axiosRequest<Map<Alpha3Code, string>, void>({
                    url: `${soknadApi}/kodeverk/eos-land`,
                    method: 'GET',
                    påvirkerSystemLaster: true,
                });

                settEøsLand(eøsLandResponse);
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
            søker.arbeidsperioderUtland.map(periode => periode.arbeidsperiodeland?.svar ?? ''),
            søker.pensjonsperioderUtland.map(periode => periode.pensjonsland?.svar ?? ''),
        ].flat();

        return !!landSvarSomKanTrigge.find(land => erEøsLand(land));
    };

    const skalTriggeEøsForBarn = (barn: IBarnMedISøknad): boolean => {
        const landSvarSomKanTriggeEøs = [
            ...(barn.andreForelder
                ? [
                      barn.andreForelder.arbeidsperioderUtland.map(
                          periode => periode.arbeidsperiodeland?.svar ?? ''
                      ),
                      barn.andreForelder.pensjonsperioderUtland.map(
                          periode => periode.pensjonsland?.svar ?? ''
                      ),
                  ]
                : []),
            barn.utenlandsperioder.map(periode => periode.oppholdsland.svar),
        ].flat();

        const jaNeiSvarSomKanTriggeEøs =
            barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA;

        return !!landSvarSomKanTriggeEøs.find(land => erEøsLand(land)) || jaNeiSvarSomKanTriggeEøs;
    };

    useEffect(() => {
        const eøsTriggetForSøker = skalTriggeEøsForSøker(søknad.søker);

        const eøsTriggetForBarn = !!søknad.barnInkludertISøknaden.find(barn =>
            skalTriggeEøsForBarn(barn)
        );

        const erEøs = eøsTriggetForSøker || eøsTriggetForBarn;

        if (erEøs !== søknad.erEøs) {
            settSøknad({
                ...søknad,
                erEøs,
            });
        }
    }, [søknad.søker, søknad.barnInkludertISøknaden]);

    return {
        erEøsLand,
        skalTriggeEøsForSøker,
        skalTriggeEøsForBarn,
        settSøkerTriggerEøs,
        settBarnSomTriggerEøs,
        søkerTriggerEøs,
        barnSomTriggerEøs,
    };
});

export { EøsProvider, useEøs };
