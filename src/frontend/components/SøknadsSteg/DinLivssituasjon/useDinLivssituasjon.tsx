import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../hooks/usePerioder';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { ISøker } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { ISøknad } from '../../../typer/søknad';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLand } from '../EøsSteg/idnummerUtils';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => ISøknad;
    validerAlleSynligeFelter: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useApp();
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs, erEøsLand } =
        useEøsContext();
    const søker = søknad.søker;
    const teksterForSteg = tekster()[ESanitySteg.DIN_LIVSSITUASJON];
    const teksterForArbeidsperiode: IArbeidsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.arbeidsperiode.søker;
    const teksterForPensjonsperiode: IPensjonsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.pensjonsperiode.søker;
    const teksterForUtenlandsperiode: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold.søker;

    /*--- ASYL ARBEID OG PENSJON ----*/

    const erAsylsøker = useJaNeiSpmFelt({
        søknadsfelt: søker.erAsylsøker,
        feilmelding: teksterForSteg.asylsoeker.feilmelding,
    });

    const arbeidIUtlandet = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeidIUtlandet,
        feilmelding: teksterForSteg.arbeidUtenforNorge.feilmelding,
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>(
        `${ArbeidsperiodeSpørsmålsId.arbeidsperioder}-${PersonType.søker}-utland`,
        søker.arbeidsperioderUtland,
        { arbeidIUtlandet },
        avhengigheter => avhengigheter.arbeidIUtlandet.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.arbeidIUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.arbeidIUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(teksterForArbeidsperiode.leggTilFeilmelding, {
                          gjelderUtland: true,
                      })
                  );
        }
    );

    const utenlandsoppholdUtenArbeid = useJaNeiSpmFelt({
        søknadsfelt: søker.utenlandsoppholdUtenArbeid,
        feilmelding: teksterForSteg.utenlandsoppholdUtenArbeid.feilmelding,
    });

    const {
        fjernPeriode: fjernUtenlandsperiode,
        leggTilPeriode: leggTilUtenlandsperiode,
        registrertePerioder: registrerteUtenlandsperioder,
    } = usePerioder<IUtenlandsperiode>(
        `${UtenlandsoppholdSpørsmålId.utenlandsopphold}-${PersonType.søker}`,
        søker.utenlandsperioder,
        { utenlandsoppholdUtenArbeid },
        avhengigheter => avhengigheter.utenlandsoppholdUtenArbeid.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.utenlandsoppholdUtenArbeid.verdi === ESvar.NEI ||
                (avhengigheter?.utenlandsoppholdUtenArbeid.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, plainTekst(teksterForUtenlandsperiode.leggTilFeilmelding));
        }
    );

    const mottarUtenlandspensjon = useJaNeiSpmFelt({
        søknadsfelt: søker.mottarUtenlandspensjon,
        feilmelding: teksterForSteg.pensjonUtland.feilmelding,
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: registrertePensjonsperioder,
    } = usePerioder<IPensjonsperiode>(
        `${PensjonsperiodeSpørsmålId.pensjonsperioder}-${PersonType.søker}-utland`,
        søker.pensjonsperioderUtland,
        { mottarUtenlandspensjon },
        avhengigheter => avhengigheter.mottarUtenlandspensjon.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.mottarUtenlandspensjon.verdi === ESvar.NEI ||
                (avhengigheter?.mottarUtenlandspensjon.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(teksterForPensjonsperiode.leggTilFeilmelding, {
                          gjelderUtland: true,
                      })
                  );
        }
    );

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IDinLivssituasjonFeltTyper,
        string
    >({
        felter: {
            erAsylsøker,
            arbeidIUtlandet,
            registrerteArbeidsperioder,
            utenlandsoppholdUtenArbeid,
            registrerteUtenlandsperioder,
            mottarUtenlandspensjon,
            registrertePensjonsperioder,
        },
        skjemanavn: 'dinlivssituasjon',
    });

    const erEnkeEnkemann = () =>
        søknad.søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
        søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER;

    const enkeSpørsmålId = () => {
        if (søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER) {
            return OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder;
        } else {
            return OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder;
        }
    };

    const filtrerteRelevanteIdNummer = () =>
        søknad.søker.idNummer.filter(idNummer =>
            idNummerLand(
                {
                    arbeidsperioderUtland:
                        arbeidIUtlandet.verdi === ESvar.JA ? registrerteArbeidsperioder.verdi : [],
                    pensjonsperioderUtland:
                        mottarUtenlandspensjon.verdi === ESvar.JA
                            ? registrertePensjonsperioder.verdi
                            : [],
                    utenlandsperioder:
                        utenlandsoppholdUtenArbeid.verdi === ESvar.JA
                            ? registrerteUtenlandsperioder.verdi
                            : [],
                },
                erEøsLand
            ).includes(idNummer.land)
        );
    const genererOppdatertSøker = (): ISøker => ({
        ...søknad.søker,
        erAsylsøker: {
            ...søknad.søker.erAsylsøker,
            svar: skjema.felter.erAsylsøker.verdi,
        },
        arbeidIUtlandet: {
            ...søknad.søker.arbeidIUtlandet,
            svar: skjema.felter.arbeidIUtlandet.verdi,
        },
        arbeidsperioderUtland:
            skjema.felter.arbeidIUtlandet.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],
        utenlandsoppholdUtenArbeid: {
            ...søknad.søker.utenlandsoppholdUtenArbeid,
            svar: skjema.felter.utenlandsoppholdUtenArbeid.verdi,
        },
        utenlandsperioder:
            utenlandsoppholdUtenArbeid.verdi === ESvar.JA ? registrerteUtenlandsperioder.verdi : [],
        mottarUtenlandspensjon: {
            ...søknad.søker.mottarUtenlandspensjon,
            svar: skjema.felter.mottarUtenlandspensjon.verdi,
        },
        pensjonsperioderUtland:
            skjema.felter.mottarUtenlandspensjon.verdi === ESvar.JA
                ? skjema.felter.registrertePensjonsperioder.verdi
                : [],
        idNummer: filtrerteRelevanteIdNummer(),
    });

    useEffect(() => {
        const oppdatertSøker = genererOppdatertSøker();
        if (skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs) {
            settSøkerTriggerEøs(prevState => !prevState);
        }
    }, [arbeidIUtlandet, mottarUtenlandspensjon]);

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        const søkerTriggetEøs = skalTriggeEøsForSøker(oppdatertSøker);
        const harEøsSteg =
            søkerTriggetEøs || !!søknad.barnInkludertISøknaden.find(barn => barn.triggetEøs);
        const oppdatertSøknad = {
            ...søknad,
            erAvdødPartnerForelder: {
                id: enkeSpørsmålId(),
                svar: erEnkeEnkemann() ? søknad.erAvdødPartnerForelder.svar : null,
            },
            barnInkludertISøknaden: søknad.barnInkludertISøknaden.map(barn => ({
                ...barn,
                andreForelderErDød: {
                    ...barn[barnDataKeySpørsmål.andreForelderErDød],
                    svar: erEnkeEnkemann()
                        ? barn[barnDataKeySpørsmål.andreForelderErDød].svar
                        : ESvar.NEI,
                },
            })),
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                if (dok.dokumentasjonsbehov === Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE)
                    return { ...dok, gjelderForSøker: erAsylsøker.verdi === ESvar.JA };
                else return dok;
            }),
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

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
    };
};
