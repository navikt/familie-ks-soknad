import React, { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { usePerioder } from '../../../hooks/usePerioder';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../typer/barn';
import { AlternativtSvarForInput, BarnetsId } from '../../../typer/common';
import { IDokumentasjon } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import {
    IArbeidsperiode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtenlandsperiode,
} from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { erNorskPostnummer, valideringAdresse } from '../../../utils/adresse';
import {
    filtrerteRelevanteIdNummerForBarn,
    genererInitiellAndreForelder,
    nullstilteEøsFelterForBarn,
    skalViseBorMedOmsorgsperson,
} from '../../../utils/barn';
import { dagensDato, erSammeDatoSomDagensDato, morgendagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from '../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import { arbeidsperiodeFeilmelding } from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLand } from '../EøsSteg/idnummerUtils';
import { OmBarnetSpørsmålsId } from './spørsmål';

export const useOmBarnet = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    barn: IBarnMedISøknad | undefined;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
} => {
    const { søknad, settSøknad } = useApp();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } = useEøs();

    const gjeldendeBarn = søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid);

    if (!gjeldendeBarn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        gjeldendeBarn.utenlandsperioder
    );

    const skalFeltetVises = (
        søknadsdataFelt: Exclude<
            barnDataKeySpørsmål,
            barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId
        >
    ) => {
        return gjeldendeBarn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt &&
            barnISøknad.id !== gjeldendeBarn.id &&
            !!barnISøknad.andreForelder &&
            (barnISøknad.sammeForelderSomAnnetBarnMedId.svar ===
                AlternativtSvarForInput.ANNEN_FORELDER ||
                barnISøknad.sammeForelderSomAnnetBarnMedId.svar === null)
    );

    /*---INSTITUSJON---*/

    const institusjonIUtlandCheckbox = useFelt<ESvar>({
        verdi: gjeldendeBarn[barnDataKeySpørsmål.institusjonIUtland].svar,
        feltId: OmBarnetSpørsmålsId.institusjonIUtland,
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonsnavn = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonsnavn],
        feilmeldingSpråkId: 'ombarnet.institusjon.navn.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
    });

    const institusjonsadresse = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonsadresse],
        feilmeldingSpråkId: 'ombarnet.institusjon.adresse.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
        customValidering: valideringAdresse,
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: gjeldendeBarn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: gjeldendeBarn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            erNorskPostnummer(trimWhiteSpace(felt.verdi))
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={
                              trimWhiteSpace(felt.verdi) === ''
                                  ? 'ombarnet.institusjon.postnummer.feilmelding'
                                  : 'ombarnet.institusjon.postnummer.format.feilmelding'
                          }
                      />
                  ),
        skalFeltetVises: avhengigheter =>
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            avhengigheter.institusjonIUtlandCheckbox.verdi === ESvar.NEI,
        avhengigheter: { institusjonIUtlandCheckbox },
    });

    const institusjonOppholdStartdato = useDatovelgerFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        feilmeldingSpråkId: 'ombarnet.institusjon.startdato.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjent({
        feltId: gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].id,
        initiellVerdi:
            gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar !==
            AlternativtSvarForInput.UKJENT
                ? gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar
                : '',
        vetIkkeCheckbox: institusjonOppholdSluttVetIkke,
        feilmeldingSpråkId: 'ombarnet.institusjon.sluttdato.feilmelding',
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        nullstillVedAvhengighetEndring: false,
        startdatoAvgrensning: erSammeDatoSomDagensDato(institusjonOppholdStartdato.verdi)
            ? morgendagensDato()
            : dagensDato(),
        customStartdatoFeilmelding: erSammeDatoSomDagensDato(institusjonOppholdStartdato.verdi)
            ? undefined
            : 'felles.dato.tilbake-i-tid.feilmelding',
    });

    /*---UTENLANDSOPPHOLD---*/
    const registrerteUtenlandsperioder = useFelt<IUtenlandsperiode[]>({
        feltId: UtenlandsoppholdSpørsmålId.utenlandsopphold,
        verdi: gjeldendeBarn.utenlandsperioder,
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />);
        },
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge),
    });

    useEffect(() => {
        registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);
    }, [utenlandsperioder]);

    const planleggerÅBoINorge12Mnd = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
        feilmeldingSpråkId: 'ombarnet.oppholdtsammenhengende.feilmelding',
        feilmeldingSpråkVerdier: { barn: gjeldendeBarn.navn },
        skalSkjules:
            !skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge) ||
            flyttetPermanentFraNorge(utenlandsperioder) ||
            !utenlandsperioder.length,
    });

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    /*--- PÅGÅENDE SØKNAD KONTANTSTØTTE FRA ANNET EØSLAND ---*/
    const pågåendeSøknadFraAnnetEøsLand = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
        feilmeldingSpråkId: 'ombarnet.pågåendesøknad.feilmelding',
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland),
    });

    const pågåendeSøknadHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
        feilmeldingSpråkId: 'ombarnet.hvilketlandsøkt.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: pågåendeSøknadFraAnnetEøsLand,
    });

    /*--- EØS SPØRSMÅL MOTTAR KONTANTSTØTTE ---*/

    const mottarEllerMottokEøsKontantstøtte = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte],
        feilmeldingSpråkId: 'ombarnet.fårellerharsøktbarnetrygdeøs.feilmelding',
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland),
    });

    const {
        fjernPeriode: fjernKontantstøttePeriode,
        leggTilPeriode: leggTilKontantstøttePeriode,
        registrertePerioder: registrerteEøsKontantstøttePerioder,
    } = usePerioder<IEøsKontantstøttePeriode>(
        gjeldendeBarn.eøsKontantstøttePerioder,
        { mottarEllerMottokEøsKontantstøtte },
        avhengigheter => avhengigheter.mottarEllerMottokEøsKontantstøtte.verdi === ESvar.JA,

        (felt, avhengigheter) => {
            return avhengigheter?.mottarEllerMottokEøsKontantstøtte.verdi === ESvar.NEI ||
                (avhengigheter?.mottarEllerMottokEøsKontantstøtte.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />);
        }
    );

    /*--- ANDRE FORELDER ---*/
    const andreForelder = gjeldendeBarn.andreForelder;

    const sammeForelderSomAnnetBarn = useFelt<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >({
        feltId: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
        verdi: gjeldendeBarn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar,
        valideringsfunksjon: (felt: FeltState<string | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'ombarnet.hvemerandreforelder.feilmelding'}
                          values={{ barn: gjeldendeBarn.navn }}
                      />
                  );
        },
        skalFeltetVises: () =>
            !!andreForelder &&
            søknad.barnInkludertISøknaden.find(barn => barn.andreForelder)?.id !==
                gjeldendeBarn.id &&
            andreBarnSomErFyltUt.length > 0,
    });

    const andreForelderKanIkkeGiOpplysninger = useFelt<ESvar>({
        verdi:
            andreForelder?.[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger].svar ?? ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
        avhengigheter: { sammeForelderSomAnnetBarn },
        skalFeltetVises: avhengigheter =>
            !!andreForelder &&
            (!avhengigheter.sammeForelderSomAnnetBarn.erSynlig ||
                avhengigheter.sammeForelderSomAnnetBarn.verdi ===
                    AlternativtSvarForInput.ANNEN_FORELDER),
    });
    const andreForelderNavn = useInputFeltMedUkjent({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.navn] ?? null,
        avhengighet: andreForelderKanIkkeGiOpplysninger,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.navn.feilmelding',
        skalVises:
            !!andreForelder &&
            (!sammeForelderSomAnnetBarn.erSynlig ||
                sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER),
    });

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(andreForelder?.[andreForelderDataKeySpørsmål.fnr].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                !!andreForelder &&
                avhengigheter &&
                (!avhengigheter.sammeForelderSomAnnetBarn.erSynlig ||
                    avhengigheter.sammeForelderSomAnnetBarn.verdi ===
                        AlternativtSvarForInput.ANNEN_FORELDER) &&
                avhengigheter.andreForelderKanIkkeGiOpplysninger &&
                avhengigheter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
            );
        },
        avhengigheter: {
            andreForelderKanIkkeGiOpplysninger,
            sammeForelderSomAnnetBarn,
        },
        nullstillVedAvhengighetEndring: false,
    });

    const andreForelderFnr = useInputFeltMedUkjent({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.fnr] ?? null,
        avhengighet: andreForelderFnrUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fnr.feilmelding',
        erFnrInput: true,
        skalVises:
            !!andreForelder &&
            (!sammeForelderSomAnnetBarn.erSynlig ||
                sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER) &&
            andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI,
    });

    const andreForelderFødselsdatoUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(
            andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar
        ),
        feltId: OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderFnrUkjent &&
                avhengigheter.andreForelderFnrUkjent.erSynlig &&
                avhengigheter.andreForelderFnrUkjent.verdi === ESvar.JA &&
                avhengigheter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
            );
        },
        avhengigheter: {
            andreForelderFnrUkjent,
            andreForelderKanIkkeGiOpplysninger,
        },
        nullstillVedAvhengighetEndring: false,
    });
    const andreForelderFødselsdato = useDatovelgerFeltMedUkjent({
        feltId: andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].id,
        initiellVerdi: formaterInitVerdiForInputMedUkjent(
            andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar
        ),
        vetIkkeCheckbox: andreForelderFødselsdatoUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fødselsdato.feilmelding',
        skalFeltetVises:
            andreForelderFnrUkjent.erSynlig &&
            andreForelderFnrUkjent.verdi === ESvar.JA &&
            andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
        sluttdatoAvgrensning: dagensDato(),
    });

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandet],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelder-arbeidutland.feilmelding'
                : 'eøs.andre-forelder.arbeid-utland.feilmelding',
        avhengigheter: {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        },
        skalSkjules: andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: andreForelderArbeidsperioderUtland,
    } = usePerioder<IArbeidsperiode>(
        andreForelder?.arbeidsperioderUtland ?? [],
        { andreForelderArbeidUtlandet },
        avhengigheter => avhengigheter.andreForelderArbeidUtlandet.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(true)} />);
        }
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andre-forelder.utenlandspensjon.feilmelding'
                : 'ombarnet.andreforelderpensjonutland.feilmelding',
        avhengigheter: {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderKanIkkeGiOpplysninger.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        },
        skalSkjules: andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: andreForelderPensjonsperioderUtland,
    } = usePerioder<IPensjonsperiode>(
        andreForelder?.pensjonsperioderUtland ?? [],
        { andreForelderPensjonUtland },
        avhengigheter => avhengigheter.andreForelderPensjonUtland.verdi === ESvar.JA,

        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(true)} />);
        }
    );

    /*--- BOSTED ---*/
    const borFastMedSøker = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borFastMedSøker],
        feilmeldingSpråkId: 'ombarnet.bor-fast.feilmelding',
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        feilmeldingSpråkId: 'ombarnet.delt-bosted.feilmelding',
        skalSkjules:
            !andreForelder ||
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: gjeldendeBarn.navn },
    });

    const { kanSendeSkjema, skjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnetUtvidetFeltTyper,
        string
    >({
        felter: {
            institusjonIUtlandCheckbox,
            institusjonsnavn,
            institusjonsadresse,
            institusjonspostnummer,
            institusjonOppholdStartdato,
            institusjonOppholdSluttdato,
            institusjonOppholdSluttVetIkke,
            registrerteUtenlandsperioder,
            planleggerÅBoINorge12Mnd,
            pågåendeSøknadFraAnnetEøsLand,
            pågåendeSøknadHvilketLand,
            mottarEllerMottokEøsKontantstøtte,
            registrerteEøsKontantstøttePerioder,
            andreForelderNavn,
            andreForelderKanIkkeGiOpplysninger,
            andreForelderFnr,
            andreForelderFnrUkjent,
            andreForelderFødselsdato,
            andreForelderFødselsdatoUkjent,
            andreForelderArbeidUtlandet,
            andreForelderArbeidsperioderUtland,
            andreForelderPensjonUtland,
            andreForelderPensjonsperioderUtland,
            borFastMedSøker,
            skriftligAvtaleOmDeltBosted,
            sammeForelderSomAnnetBarn,
        },
        skjemanavn: `om-barnet-${gjeldendeBarn.id}`,
    });

    const genererOppdatertDokumentasjon = (
        dokumentasjon: IDokumentasjon,
        kreverDokumentasjon,
        barnId: string
    ) => {
        let oppdatertDokumentasjon = dokumentasjon;
        if (kreverDokumentasjon) {
            if (!dokumentasjon.gjelderForBarnId.includes(barnId)) {
                oppdatertDokumentasjon = {
                    ...dokumentasjon,
                    gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].concat(barnId),
                };
            }
        } else {
            oppdatertDokumentasjon = {
                ...dokumentasjon,
                gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].filter(
                    id => id !== barnId
                ),
            };
        }

        return oppdatertDokumentasjon;
    };

    const filtrerteRelevanteIdNummerForAndreForelder = (
        andreForelder: IAndreForelder
    ): IIdNummer[] => {
        return andreForelder.idNummer.filter(idNummer => {
            return idNummerLand(
                {
                    arbeidsperioderUtland:
                        andreForelderArbeidUtlandet.verdi === ESvar.JA
                            ? andreForelderArbeidsperioderUtland.verdi
                            : [],
                    pensjonsperioderUtland:
                        andreForelderPensjonUtland.verdi === ESvar.JA
                            ? andreForelderPensjonsperioderUtland.verdi
                            : [],
                },
                erEøsLand
            ).includes(idNummer.land);
        });
    };

    const annetBarnMedSammeForelder = (): IBarnMedISøknad | undefined =>
        andreBarnSomErFyltUt.find(barn => barn.id === sammeForelderSomAnnetBarn.verdi);

    const genererOppdatertAndreForelder = (andreForelder: IAndreForelder): IAndreForelder => {
        const barnMedSammeForelder = annetBarnMedSammeForelder();
        const andreForelderErDød = gjeldendeBarn.andreForelderErDød.svar === ESvar.JA;

        if (barnMedSammeForelder?.andreForelder) {
            return {
                ...barnMedSammeForelder.andreForelder,
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
            };
        } else if (andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA) {
            return {
                ...genererInitiellAndreForelder(null, andreForelderErDød),
                kanIkkeGiOpplysninger: {
                    ...andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger],
                    svar: ESvar.JA,
                },
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
            };
        } else {
            return {
                ...andreForelder,
                kanIkkeGiOpplysninger: {
                    ...andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger],
                    svar: ESvar.NEI,
                },
                idNummer: filtrerteRelevanteIdNummerForAndreForelder(andreForelder),
                navn: {
                    ...andreForelder[andreForelderDataKeySpørsmål.navn],
                    svar: trimWhiteSpace(andreForelderNavn.verdi),
                },
                fnr: {
                    ...andreForelder[andreForelderDataKeySpørsmål.fnr],
                    svar: svarForSpørsmålMedUkjent(andreForelderFnrUkjent, andreForelderFnr),
                },
                fødselsdato: {
                    ...andreForelder[andreForelderDataKeySpørsmål.fødselsdato],
                    svar: svarForSpørsmålMedUkjent(
                        andreForelderFødselsdatoUkjent,
                        andreForelderFødselsdato
                    ),
                },
                arbeidUtlandet: {
                    ...andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet],
                    svar: andreForelderArbeidUtlandet.verdi,
                },
                arbeidsperioderUtland:
                    andreForelderArbeidUtlandet.verdi === ESvar.JA
                        ? andreForelderArbeidsperioderUtland.verdi
                        : [],
                pensjonUtland: {
                    ...andreForelder[andreForelderDataKeySpørsmål.pensjonUtland],
                    svar: andreForelderPensjonUtland.verdi,
                },
                pensjonsperioderUtland:
                    andreForelderPensjonUtland.verdi === ESvar.JA
                        ? andreForelderPensjonsperioderUtland.verdi
                        : [],
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
            };
        }
    };

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        const eøsKontantstøttePerioder =
            mottarEllerMottokEøsKontantstøtte.verdi === ESvar.JA
                ? registrerteEøsKontantstøttePerioder.verdi
                : [];
        const utenlandsperioder = registrerteUtenlandsperioder.verdi;

        const borMedOmsorgsperson = {
            ...barn.borMedOmsorgsperson,
            svar: skalViseBorMedOmsorgsperson(
                barn.borMedAndreForelder.svar,
                borFastMedSøker.verdi,
                barn.oppholderSegIInstitusjon.svar,
                barn.andreForelderErDød.svar,
                barn.erFosterbarn.svar
            )
                ? barn.borMedOmsorgsperson.svar
                : null,
        };

        return {
            ...barn,
            idNummer: filtrerteRelevanteIdNummerForBarn(
                { eøsKontantstøttePerioder, utenlandsperioder },
                pågåendeSøknadFraAnnetEøsLand.verdi,
                pågåendeSøknadHvilketLand.verdi,
                barn,
                erEøsLand
            ),
            barnErFyltUt: true,
            utenlandsperioder: skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge)
                ? utenlandsperioder
                : [],
            institusjonIUtland: {
                ...barn.institusjonIUtland,
                svar: institusjonIUtlandCheckbox.verdi,
            },
            institusjonsnavn: {
                ...barn.institusjonsnavn,
                svar: institusjonsnavn.erSynlig ? trimWhiteSpace(institusjonsnavn.verdi) : '',
            },
            institusjonsadresse: {
                ...barn.institusjonsadresse,
                svar: institusjonsadresse.erSynlig ? trimWhiteSpace(institusjonsadresse.verdi) : '',
            },
            institusjonspostnummer: {
                ...barn.institusjonspostnummer,
                svar: institusjonspostnummer.erSynlig
                    ? trimWhiteSpace(institusjonspostnummer.verdi)
                    : '',
            },
            institusjonOppholdStartdato: {
                ...barn.institusjonOppholdStartdato,
                svar: institusjonOppholdStartdato.verdi,
            },
            institusjonOppholdSluttdato: {
                ...barn.institusjonOppholdSluttdato,
                svar: svarForSpørsmålMedUkjent(
                    institusjonOppholdSluttVetIkke,
                    institusjonOppholdSluttdato
                ),
            },
            planleggerÅBoINorge12Mnd: {
                ...barn.planleggerÅBoINorge12Mnd,
                svar: !flyttetPermanentFraNorge(utenlandsperioder)
                    ? skjema.felter.planleggerÅBoINorge12Mnd.verdi
                    : null,
            },
            pågåendeSøknadFraAnnetEøsLand: {
                ...barn.pågåendeSøknadFraAnnetEøsLand,
                svar: pågåendeSøknadFraAnnetEøsLand.verdi,
            },
            pågåendeSøknadHvilketLand: {
                ...barn.pågåendeSøknadHvilketLand,
                svar: pågåendeSøknadHvilketLand.verdi,
            },
            mottarEllerMottokEøsKontantstøtte: {
                ...barn.mottarEllerMottokEøsKontantstøtte,
                svar: mottarEllerMottokEøsKontantstøtte.verdi,
            },
            eøsKontantstøttePerioder:
                mottarEllerMottokEøsKontantstøtte.verdi === ESvar.JA
                    ? skjema.felter.registrerteEøsKontantstøttePerioder.verdi
                    : [],
            borFastMedSøker: {
                ...barn.borFastMedSøker,
                svar: borFastMedSøker.verdi,
            },
            borMedOmsorgsperson,
            omsorgsperson: borMedOmsorgsperson.svar === ESvar.JA ? barn.omsorgsperson : null,
            adresse: {
                ...barn.adresse,
                svar:
                    barn.erFosterbarn.svar === ESvar.JA ||
                    (barn.borMedAndreForelder.svar === ESvar.JA &&
                        andreForelderKanIkkeGiOpplysninger.verdi == ESvar.JA)
                        ? barn.adresse.svar
                        : '',
            },
            sammeForelderSomAnnetBarnMedId: {
                ...barn.sammeForelderSomAnnetBarnMedId,
                svar: sammeForelderSomAnnetBarn.verdi,
            },
            ...(!!barn.andreForelder && {
                andreForelder: genererOppdatertAndreForelder(barn.andreForelder),
            }),
        };
    };

    useEffect(() => {
        const oppdatertBarn: IBarnMedISøknad = genererOppdatertBarn(gjeldendeBarn);
        const skalTriggeEøs = skalTriggeEøsForBarn(oppdatertBarn);
        if (
            (skalTriggeEøs && !barnSomTriggerEøs.includes(gjeldendeBarn.id)) ||
            (!skalTriggeEøs && barnSomTriggerEøs.includes(gjeldendeBarn.id))
        ) {
            settBarnSomTriggerEøs(prevState => {
                if (skalTriggeEøs) {
                    return prevState.concat(gjeldendeBarn.id);
                } else {
                    return prevState.filter(
                        barnSomTriggetEøsId => barnSomTriggetEøsId !== gjeldendeBarn.id
                    );
                }
            });
        }
    }, [andreForelderArbeidUtlandet, andreForelderPensjonUtland, utenlandsperioder]);

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn => {
                let oppdatertBarn;
                if (barn === gjeldendeBarn) {
                    oppdatertBarn = genererOppdatertBarn(barn);
                } else if (barn.sammeForelderSomAnnetBarnMedId.svar === gjeldendeBarn.id) {
                    oppdatertBarn = {
                        ...barn,
                        ...(!!gjeldendeBarn.andreForelder && {
                            andreForelder: genererOppdatertAndreForelder(
                                gjeldendeBarn.andreForelder
                            ),
                        }),
                    };
                } else {
                    oppdatertBarn = barn;
                }
                const barnTriggetEøs = skalTriggeEøsForBarn(oppdatertBarn);
                const harEøsSteg = barnTriggetEøs || søknad.søker.triggetEøs;

                return {
                    ...oppdatertBarn,
                    triggetEøs: barnTriggetEøs,
                    ...(!harEøsSteg && nullstilteEøsFelterForBarn(oppdatertBarn)),
                };
            });

        const skalNullstilleEøsForSøker =
            !søknad.søker.triggetEøs &&
            !oppdatertBarnInkludertISøknaden.find(barn => barn.triggetEøs);

        settSøknad({
            ...søknad,
            søker: skalNullstilleEøsForSøker
                ? { ...søknad.søker, ...nullstilteEøsFelterForSøker(søknad.søker) }
                : søknad.søker,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && !!andreForelder,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
                        return genererOppdatertDokumentasjon(
                            dok,
                            borFastMedSøker.verdi === ESvar.JA && !gjeldendeBarn.borMedSøker,
                            gjeldendeBarn.id
                        );
                    default:
                        return dok;
                }
            }),
        });
    };

    return {
        oppdaterSøknad,
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        barn: gjeldendeBarn,
        andreBarnSomErFyltUt,
        validerAlleSynligeFelter,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilKontantstøttePeriode,
        fjernKontantstøttePeriode,
    };
};
