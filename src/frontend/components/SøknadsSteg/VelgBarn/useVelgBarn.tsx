import { useEffect, useState } from 'react';

import { feil, type ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useStegContext } from '../../../context/StegContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';
import { IBarn } from '../../../typer/person';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IVelgBarnFeltTyper } from '../../../typer/skjema';
import { ISøknad } from '../../../typer/søknad';
import { genererInitialBarnMedISøknad } from '../../../utils/barn';

import { IVelgBarnTekstinnhold } from './innholdTyper';
import { VelgBarnSpørsmålId } from './spørsmål';

export const useVelgBarn = (): {
    skjema: ISkjema<IVelgBarnFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => ISøknad;
    håndterVelgBarnToggle: (barn: IBarn, erMedISøknad: boolean) => void;
    barnSomSkalVæreMed: IBarn[];
    fjernBarn: (ident: string) => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad, mellomlagre, tekster, plainTekst } = useAppContext();
    const { barnInkludertISøknaden } = søknad;
    const { settBarnForSteg, hentNåværendeStegIndex } = useStegContext();
    const { settBarnSomTriggerEøs } = useEøs();
    const [barnSomSkalVæreMed, settBarnSomSkalVæreMed] =
        useState<IBarnMedISøknad[]>(barnInkludertISøknaden);

    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];

    useEffect(() => {
        settBarnForSteg(barnSomSkalVæreMed);
    }, [barnSomSkalVæreMed]);

    useEffect(() => {
        mellomlagre(søknad, hentNåværendeStegIndex());
    }, [søknad.barnRegistrertManuelt]);

    const fjernBarn = (id: BarnetsId) => {
        settSøknad({
            ...søknad,
            barnRegistrertManuelt: søknad.barnRegistrertManuelt.filter(barn => id !== barn.id),
        });
        settBarnSomSkalVæreMed(barnSomSkalVæreMed.filter(barn => id !== barn.id));
        settBarnSomTriggerEøs(prevState => prevState.filter(barnetsId => id !== barnetsId));
    };

    const barnMedISøknad = useFelt<IBarn[]>({
        feltId: VelgBarnSpørsmålId.velgBarn,
        verdi: barnSomSkalVæreMed,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.barnSomSkalVæreMed.length > 0
                ? ok(felt)
                : feil(felt, plainTekst(teksterForSteg.maaVelgeEtBarnForAaGaaVidere));
        },
        avhengigheter: { barnSomSkalVæreMed },
    });

    const oppdaterSøknad = () => {
        const barnSomAlleredeErLagtTil = barnSomSkalVæreMed.filter(
            barnSomSkalVæreMed =>
                !!barnInkludertISøknaden.find(barn => barn.id === barnSomSkalVæreMed.id)
        );

        const nyeBarnSomSkalLeggesTil = barnSomSkalVæreMed.filter(
            barnSomSkalVæreMed =>
                !barnSomAlleredeErLagtTil.find(
                    barnLagtTil => barnLagtTil.id === barnSomSkalVæreMed.id
                )
        );

        const oppdaterteBarn = barnSomAlleredeErLagtTil.concat(
            nyeBarnSomSkalLeggesTil.map(barn => genererInitialBarnMedISøknad(barn))
        );
        const mapIdentTilId = oppdaterteBarn.map(barn => barn.id);
        const oppdatertDokumentasjon = søknad.dokumentasjon.map(dok => {
            return {
                ...dok,
                gjelderForBarnId: dok.gjelderForBarnId.filter(barnId =>
                    mapIdentTilId.includes(barnId)
                ),
            };
        });

        const oppdatertSøknad = {
            ...søknad,
            barnInkludertISøknaden: oppdaterteBarn,
            dokumentasjon: oppdatertDokumentasjon,
        };

        settSøknad(oppdatertSøknad);
        return oppdatertSøknad;
    };

    const håndterVelgBarnToggle = (barn: IBarn, erMedISøknad: boolean) => {
        const skalVæreMed = !erMedISøknad;
        settBarnSomSkalVæreMed(prevState =>
            skalVæreMed
                ? prevState.concat(genererInitialBarnMedISøknad(barn))
                : prevState.filter(barnMedISøknad => barnMedISøknad.id !== barn.id)
        );
        if (!skalVæreMed) {
            settBarnSomTriggerEøs(prevState =>
                prevState.filter(barnetsId => barn.id !== barnetsId)
            );
        }
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IVelgBarnFeltTyper,
        string
    >({
        felter: {
            barnMedISøknad,
        },
        skjemanavn: 'velgbarn',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        håndterVelgBarnToggle,
        barnSomSkalVæreMed,
        fjernBarn,
        validerAlleSynligeFelter,
    };
};
