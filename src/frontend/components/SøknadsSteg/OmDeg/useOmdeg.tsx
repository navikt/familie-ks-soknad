import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../hooks/usePerioder';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLandMedPeriodeType, PeriodeType } from '../EøsSteg/idnummerUtils';
import { IOmDegTekstinnhold } from './innholdTyper';

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useApp();
    const { erEøsLand } = useEøs();
    const søker = søknad.søker;
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs } = useEøs();
    const teksterForSteg: IOmDegTekstinnhold = tekster()[ESanitySteg.OM_DEG];
    const teksterForUtenlandsperiode: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold.søker;

    const borPåRegistrertAdresse = useJaNeiSpmFelt({
        søknadsfelt: søker.borPåRegistrertAdresse,
        feilmelding: teksterForSteg.borPaaAdressen.feilmelding,
        skalSkjules: !søker.adresse || søker.adressebeskyttelse,
    });

    const værtINorgeITolvMåneder = useJaNeiSpmFelt({
        søknadsfelt: søker.værtINorgeITolvMåneder,
        feilmelding: teksterForSteg.oppholdtDegSammenhengende.feilmelding,
    });

    const {
        fjernPeriode: fjernUtenlandsperiode,
        leggTilPeriode: leggTilUtenlandsperiode,
        registrertePerioder: registrerteUtenlandsperioder,
    } = usePerioder<IUtenlandsperiode>(
        `${UtenlandsoppholdSpørsmålId.utenlandsopphold}-${PersonType.søker}`,
        søker.utenlandsperioder,
        { værtINorgeITolvMåneder },
        avhengigheter => avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI,
        (felt, avhengigheter) => {
            return avhengigheter?.værtINorgeITolvMåneder.verdi === ESvar.JA ||
                (avhengigheter?.værtINorgeITolvMåneder.verdi === ESvar.NEI && felt.verdi.length)
                ? ok(felt)
                : feil(felt, plainTekst(teksterForUtenlandsperiode.leggTilFeilmelding));
        }
    );

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
        skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs &&
            settSøkerTriggerEøs(prevState => !prevState);
    }, [værtINorgeITolvMåneder]);

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
        utenlandsperioder:
            værtINorgeITolvMåneder.verdi === ESvar.NEI ? registrerteUtenlandsperioder.verdi : [],
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
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
    };
};
