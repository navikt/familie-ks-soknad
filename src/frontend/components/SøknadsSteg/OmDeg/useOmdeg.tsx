import React, { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLandMedPeriodeType, PeriodeType } from '../EøsSteg/idnummerUtils';

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
} => {
    const { søknad, settSøknad } = useApp();
    const { erEøsLand } = useEøs();
    const søker = søknad.søker;
    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        søker.utenlandsperioder
    );
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs } = useEøs();

    const borPåRegistrertAdresse = useJaNeiSpmFelt({
        søknadsfelt: søker.borPåRegistrertAdresse,
        feilmeldingSpråkId: 'omdeg.borpådenneadressen.feilmelding',
        skalSkjules: !søker.adresse || søker.adressebeskyttelse,
    });

    const værtINorgeITolvMåneder = useJaNeiSpmFelt({
        søknadsfelt: søker.værtINorgeITolvMåneder,
        feilmeldingSpråkId: 'omdeg.oppholdtsammenhengende.feilmelding',
    });

    const registrerteUtenlandsperioder = useFelt<IUtenlandsperiode[]>({
        feltId: UtenlandsoppholdSpørsmålId.utenlandsopphold,
        verdi: utenlandsperioder,
        avhengigheter: {
            værtINorgeITolvMåneder,
        },
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI;
        },
    });

    const planleggerÅBoINorgeTolvMnd = useJaNeiSpmFelt({
        søknadsfelt: søker.planleggerÅBoINorgeTolvMnd,
        feilmeldingSpråkId: 'omdeg.planlagt-opphold-sammenhengende.feilmelding',
        avhengigheter: {
            værtINorgeITolvMåneder: { hovedSpørsmål: værtINorgeITolvMåneder },
        },
        skalSkjules:
            flyttetPermanentFraNorge(utenlandsperioder) ||
            værtINorgeITolvMåneder.verdi === ESvar.JA ||
            (værtINorgeITolvMåneder.verdi === ESvar.NEI && !utenlandsperioder.length),
    });

    useEffect(() => {
        registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);

        const oppdatertSøker = genererOppdatertSøker();
        skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs &&
            settSøkerTriggerEøs(prevState => !prevState);
    }, [værtINorgeITolvMåneder, utenlandsperioder]);

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    const gyldigVerdiPåIdNummer = (idNummerObj: IIdNummer) =>
        idNummerObj.idnummer !== AlternativtSvarForInput.UKJENT ||
        relevanteLandMedPeriodeType().find(
            landMedPeriode => idNummerObj.land === landMedPeriode.land
        )?.periodeType === PeriodeType.utenlandsperiode;

    const relevanteLandMedPeriodeType = () =>
        idNummerLandMedPeriodeType(
            {
                arbeidsperioderUtland: søker.arbeidsperioderUtland,
                pensjonsperioderUtland: søker.pensjonsperioderUtland,
                utenlandsperioder:
                    værtINorgeITolvMåneder.verdi === ESvar.NEI
                        ? registrerteUtenlandsperioder.verdi
                        : [],
            },
            erEøsLand
        );

    const filtrerteRelevanteIdNummer = (): IIdNummer[] =>
        søknad.søker.idNummer.filter(
            idNummerObj =>
                relevanteLandMedPeriodeType()
                    .map(landMedPeriode => landMedPeriode.land)
                    .includes(idNummerObj.land) && gyldigVerdiPåIdNummer(idNummerObj)
        );

    const genererOppdatertSøker = () => ({
        ...søker,
        utenlandsperioder: værtINorgeITolvMåneder.verdi === ESvar.NEI ? utenlandsperioder : [],
        idNummer: filtrerteRelevanteIdNummer(),
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
            svar:
                !flyttetPermanentFraNorge(utenlandsperioder) &&
                værtINorgeITolvMåneder.verdi === ESvar.NEI
                    ? skjema.felter.planleggerÅBoINorgeTolvMnd.verdi
                    : null,
        },
    });

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        const søkerTriggetEøs = skalTriggeEøsForSøker(oppdatertSøker);
        const harEøsSteg =
            søkerTriggetEøs || !!søknad.barnInkludertISøknaden.find(barn => barn.triggetEøs);

        settSøknad({
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
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmDegFeltTyper,
        string
    >({
        felter: {
            borPåRegistrertAdresse,
            værtINorgeITolvMåneder,
            planleggerÅBoINorgeTolvMnd,
            registrerteUtenlandsperioder,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    };
};
