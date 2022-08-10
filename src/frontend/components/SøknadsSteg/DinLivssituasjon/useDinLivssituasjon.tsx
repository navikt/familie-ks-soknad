import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../hooks/usePerioder';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { IArbeidsperiode, IPensjonsperiode } from '../../../typer/perioder';
import { ISøker } from '../../../typer/person';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { arbeidsperiodeFeilmelding } from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { idNummerLand } from '../EøsSteg/idnummerUtils';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
} => {
    const { søknad, settSøknad } = useApp();
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs, erEøsLand } = useEøs();
    const søker = søknad.søker;

    /*--- ASYL ARBEID OG PENSJON ----*/

    const erAsylsøker = useJaNeiSpmFelt({
        søknadsfelt: søker.erAsylsøker,
        feilmeldingSpråkId: 'omdeg.asylsøker.feilmelding',
    });

    const arbeidIUtlandet = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeidIUtlandet,
        feilmeldingSpråkId: 'eøs.arbeid-utland.feilmelding',
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>(
        søker.arbeidsperioderUtland,
        { arbeidIUtlandet },
        avhengigheter => avhengigheter.arbeidIUtlandet.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.arbeidIUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.arbeidIUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(true)} />);
        }
    );

    const mottarUtenlandspensjon = useJaNeiSpmFelt({
        søknadsfelt: søker.mottarUtenlandspensjon,
        feilmeldingSpråkId: 'omdeg.pensjonutland.feilmelding',
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: registrertePensjonsperioder,
    } = usePerioder<IPensjonsperiode>(
        søker.pensjonsperioderUtland,
        { mottarUtenlandspensjon },
        avhengigheter => avhengigheter.mottarUtenlandspensjon.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.mottarUtenlandspensjon.verdi === ESvar.NEI ||
                (avhengigheter?.mottarUtenlandspensjon.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(true)} />);
        }
    );

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IDinLivssituasjonFeltTyper,
        string
    >({
        felter: {
            erAsylsøker,
            arbeidIUtlandet: arbeidIUtlandet,
            registrerteArbeidsperioder,
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

    const filtrerteRelevanteIdNummer = () => {
        return søknad.søker.idNummer.filter(idNummer => {
            return idNummerLand(
                {
                    arbeidsperioderUtland:
                        arbeidIUtlandet.verdi === ESvar.JA ? registrerteArbeidsperioder.verdi : [],
                    pensjonsperioderUtland:
                        mottarUtenlandspensjon.verdi === ESvar.JA
                            ? registrertePensjonsperioder.verdi
                            : [],
                    utenlandsperioder: søker.utenlandsperioder,
                },
                erEøsLand
            ).includes(idNummer.land);
        });
    };

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
        skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs &&
            settSøkerTriggerEøs(prevState => !prevState);
    }, [arbeidIUtlandet, mottarUtenlandspensjon]);

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        const søkerTriggetEøs = skalTriggeEøsForSøker(oppdatertSøker);
        const harEøsSteg =
            søkerTriggetEøs || !!søknad.barnInkludertISøknaden.find(barn => barn.triggetEøs);

        settSøknad({
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
        });
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        fjernPensjonsperiode,
        leggTilPensjonsperiode,
    };
};
