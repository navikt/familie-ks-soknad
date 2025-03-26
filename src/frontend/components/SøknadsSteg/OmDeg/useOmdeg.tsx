import { useEffect } from 'react';

import { type ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { ISøknad } from '../../../typer/søknad';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';

import { IOmDegTekstinnhold } from './innholdTyper';

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => ISøknad;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad, tekster } = useApp();
    const søker = søknad.søker;
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs } = useEøsContext();
    const teksterForSteg: IOmDegTekstinnhold = tekster()[ESanitySteg.OM_DEG];

    const borPåRegistrertAdresse = useJaNeiSpmFelt({
        søknadsfelt: søker.borPåRegistrertAdresse,
        feilmelding: teksterForSteg.borPaaAdressen.feilmelding,
        skalSkjules: !søker.adresse || søker.adressebeskyttelse,
    });

    const værtINorgeITolvMåneder = useJaNeiSpmFelt({
        søknadsfelt: søker.værtINorgeITolvMåneder,
        feilmelding: teksterForSteg.oppholdtDegSammenhengende.feilmelding,
    });

    const planleggerÅBoINorgeTolvMnd = useJaNeiSpmFelt({
        søknadsfelt: søker.planleggerÅBoINorgeTolvMnd,
        feilmelding: teksterForSteg.planleggerAaBoSammenhengende.feilmelding,
    });

    const yrkesaktivFemÅr = useJaNeiSpmFelt({
        søknadsfelt: søker.yrkesaktivFemÅr,
        feilmelding: teksterForSteg.medlemAvFolketrygden.feilmelding,
    });

    useEffect(() => {
        const oppdatertSøker = genererOppdatertSøker();
        if (skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs) {
            settSøkerTriggerEøs(prevState => !prevState);
        }
    }, [værtINorgeITolvMåneder]);

    const genererOppdatertSøker = () => ({
        ...søker,
        borPåRegistrertAdresse: {
            ...søker.borPåRegistrertAdresse,
            svar: skjema.felter.borPåRegistrertAdresse.verdi,
        },
        værtINorgeITolvMåneder: {
            ...søker.værtINorgeITolvMåneder,
            svar: skjema.felter.værtINorgeITolvMåneder.verdi,
        },
        planleggerÅBoINorgeTolvMnd: {
            ...søker.planleggerÅBoINorgeTolvMnd,
            svar: skjema.felter.planleggerÅBoINorgeTolvMnd.verdi,
        },
        yrkesaktivFemÅr: {
            ...søker.yrkesaktivFemÅr,
            svar: skjema.felter.yrkesaktivFemÅr.verdi,
        },
    });

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        const søkerTriggetEøs = skalTriggeEøsForSøker(oppdatertSøker);
        const harEøsSteg =
            søkerTriggetEøs || !!søknad.barnInkludertISøknaden.find(barn => barn.triggetEøs);

        const oppdatertSøknad = {
            ...søknad,
            søker: {
                ...oppdatertSøker,
                triggetEøs: søkerTriggetEøs,
                ...(!harEøsSteg && nullstilteEøsFelterForSøker(søknad.søker)),
            },
            ...(!harEøsSteg && {
                barnInkludertISøknaden: søknad.barnInkludertISøknaden.map(barn => ({
                    ...barn,
                    ...nullstilteEøsFelterForBarn(barn),
                })),
            }),
        };
        settSøknad(oppdatertSøknad);
        return oppdatertSøknad;
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmDegFeltTyper,
        string
    >({
        felter: {
            borPåRegistrertAdresse,
            værtINorgeITolvMåneder,
            planleggerÅBoINorgeTolvMnd,
            yrkesaktivFemÅr,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
    };
};
