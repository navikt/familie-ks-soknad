import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
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
    IBarnehageplassPeriode,
    IEøsKontantstøttePeriode,
    IPensjonsperiode,
    IUtenlandsperiode,
} from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import {
    filtrerteRelevanteIdNummerForBarn,
    genererInitiellAndreForelder,
    nullstilteEøsFelterForBarn,
    skalViseBorMedOmsorgsperson,
} from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from '../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnehageplassPeriodeSpørsmålId } from '../../Felleskomponenter/Barnehagemodal/spørsmål';
import { KontantstøttePeriodeSpørsmålId } from '../../Felleskomponenter/KontantstøttePeriode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLand } from '../EøsSteg/idnummerUtils';
import { IOmBarnetTekstinnhold } from './innholdTyper';
import { OmBarnetSpørsmålsId } from './spørsmål';

export const useOmBarnet = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    barn: IBarnMedISøknad | undefined;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiodeBarn: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiodeBarn: (periode: IUtenlandsperiode) => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    leggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    fjernBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
} => {
    const { søknad, settSøknad, tekster, plainTekst } = useApp();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } = useEøs();
    const teksterForSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];
    const teksterForModaler = tekster()[ESanitySteg.FELLES].modaler;

    const gjeldendeBarn = søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid);

    if (!gjeldendeBarn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const andreForelder = gjeldendeBarn.andreForelder;

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

    /*---ADOPERT---*/
    const utbetaltForeldrepengerEllerEngangsstønad = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad],
        feilmelding: teksterForSteg.utbetaltForeldrepengerEllerEngangsstoenad.feilmelding,
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.erAdoptert),
    });

    /*---UTENLANDSOPPHOLD---*/
    const {
        fjernPeriode: fjernUtenlandsperiodeBarn,
        leggTilPeriode: leggTilUtenlandsperiodeBarn,
        registrertePerioder: barnRegistrerteUtenlandsperioder,
    } = usePerioder<IUtenlandsperiode>(
        `${UtenlandsoppholdSpørsmålId.utenlandsopphold}-${PersonType.barn}`,
        gjeldendeBarn.utenlandsperioder ?? [],
        {},
        () => skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge),
        felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(teksterForModaler.utenlandsopphold.barn.leggTilFeilmelding)
                  );
        }
    );

    const planleggerÅBoINorge12Mnd = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
        feilmelding: teksterForSteg.planlagtBoSammenhengendeINorge.feilmelding,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        skalSkjules:
            !skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge) ||
            flyttetPermanentFraNorge(barnRegistrerteUtenlandsperioder.verdi) ||
            !barnRegistrerteUtenlandsperioder.verdi.length,
    });

    /*--- PÅGÅENDE SØKNAD KONTANTSTØTTE FRA ANNET EØSLAND ---*/
    const pågåendeSøknadFraAnnetEøsLand = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
        feilmelding: teksterForSteg.paagaaendeSoeknadYtelse.feilmelding,
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland),
    });

    const pågåendeSøknadHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
        feilmelding: teksterForSteg.hvilketLandYtelse.feilmelding,
        avhengigSvarCondition: ESvar.JA,
        avhengighet: pågåendeSøknadFraAnnetEøsLand,
    });

    /*--- MOTTAR KONTANTSTØTTE FRA ANNET EØSLAND ---*/
    const mottarEllerMottokEøsKontantstøtte = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte],
        feilmelding: teksterForSteg.faarEllerHarFaattYtelseFraAnnetLand.feilmelding,
        skalSkjules: !skalFeltetVises(barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland),
    });

    const {
        fjernPeriode: fjernKontantstøttePeriode,
        leggTilPeriode: leggTilKontantstøttePeriode,
        registrertePerioder: registrerteEøsKontantstøttePerioder,
    } = usePerioder<IEøsKontantstøttePeriode>(
        `${KontantstøttePeriodeSpørsmålId.kontantstøttePeriodeEøs}-${PersonType.søker}`,
        gjeldendeBarn.eøsKontantstøttePerioder,
        { mottarEllerMottokEøsKontantstøtte },
        avhengigheter => avhengigheter.mottarEllerMottokEøsKontantstøtte.verdi === ESvar.JA,

        (felt, avhengigheter) => {
            return avhengigheter?.mottarEllerMottokEøsKontantstøtte.verdi === ESvar.NEI ||
                (avhengigheter?.mottarEllerMottokEøsKontantstøtte.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, plainTekst(teksterForModaler.eøsYtelse.søker.leggTilFeilmelding));
        }
    );
    /*--- BARNEHAGEPLASS ---*/
    const {
        fjernPeriode: fjernBarnehageplassPeriode,
        leggTilPeriode: leggTilBarnehageplassPeriode,
        registrertePerioder: registrerteBarnehageplassPerioder,
    } = usePerioder<IBarnehageplassPeriode>(
        `${BarnehageplassPeriodeSpørsmålId.barnehageplassPeriode}-${PersonType.barn}`,
        gjeldendeBarn.barnehageplassPerioder,
        {},
        () => skalFeltetVises(barnDataKeySpørsmål.harBarnehageplass),
        felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, plainTekst(teksterForModaler.barnehageplass.leggTilFeilmelding));
        }
    );
    useEffect(() => {
        registrerteBarnehageplassPerioder.validerOgSettFelt(gjeldendeBarn.barnehageplassPerioder);
    }, [gjeldendeBarn.barnehageplassPerioder]);

    /*--- ANDRE FORELDER ---*/
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
                      plainTekst(teksterForSteg.hvemErBarnSinAndreForelder.feilmelding, {
                          barnetsNavn: gjeldendeBarn.navn,
                      })
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
        feilmelding: teksterForSteg.navnAndreForelder.feilmelding,
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
        feilmelding: teksterForSteg.foedselsnummerDnummerAndreForelder.feilmelding,
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
                avhengigheter?.andreForelderFnrUkjent?.erSynlig &&
                avhengigheter?.andreForelderFnrUkjent?.verdi === ESvar.JA &&
                avhengigheter?.andreForelderKanIkkeGiOpplysninger?.verdi === ESvar.NEI
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
        feilmelding: teksterForSteg.foedselsdatoAndreForelder.feilmelding,
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
        feilmelding:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? teksterForSteg.arbeidUtenforNorgeAndreForelderGjenlevende.feilmelding
                : teksterForSteg.arbeidUtenforNorgeAndreForelder.feilmelding,
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
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
    });

    const andreForelderYrkesaktivFemÅr = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.yrkesaktivFemÅr],
        feilmelding: teksterForSteg.medlemAvFolktetrygdenAndreForelder.feilmelding,
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
        skalSkjules:
            andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA ||
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA,
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: andreForelderArbeidsperioderUtland,
    } = usePerioder<IArbeidsperiode>(
        `${ArbeidsperiodeSpørsmålsId.arbeidsperioder}-${PersonType.andreForelder}-utland`,
        andreForelder?.arbeidsperioderUtland ?? [],
        { andreForelderArbeidUtlandet },
        avhengigheter => avhengigheter.andreForelderArbeidUtlandet.verdi === ESvar.JA,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          teksterForModaler.arbeidsperiode.andreForelder.leggTilFeilmelding,
                          {
                              gjelderUtland: true,
                          }
                      )
                  );
        }
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland],
        feilmelding:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? teksterForSteg.pensjonUtlandAndreForelderGjenlevende.feilmelding
                : teksterForSteg.pensjonUtlandAndreForelder.feilmelding,
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
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: andreForelderPensjonsperioderUtland,
    } = usePerioder<IPensjonsperiode>(
        `${PensjonsperiodeSpørsmålId.pensjonsperioder}-${PersonType.andreForelder}-utland`,
        andreForelder?.pensjonsperioderUtland ?? [],
        { andreForelderPensjonUtland },
        avhengigheter => avhengigheter.andreForelderPensjonUtland.verdi === ESvar.JA,

        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(
                      felt,
                      plainTekst(
                          teksterForModaler.pensjonsperiode.andreForelder.leggTilFeilmelding,
                          {
                              gjelderUtland: true,
                          }
                      )
                  );
        }
    );

    /*--- BOSTED ---*/
    const borFastMedSøker = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borFastMedSøker],
        feilmelding: teksterForSteg.borBarnFastSammenMedDeg.feilmelding,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
    });

    const foreldreBorSammen = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.foreldreBorSammen],
        feilmelding: teksterForSteg.borForeldreSammen.feilmelding,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        skalSkjules: borFastMedSøker.verdi !== ESvar.JA,
    });

    const søkerDeltKontantstøtte = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.søkerDeltKontantstøtte],
        feilmelding: teksterForSteg.soekerDeltKontantstoette.feilmelding,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
        skalSkjules: !foreldreBorSammen.erSynlig || foreldreBorSammen.verdi !== ESvar.NEI,
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        feilmelding: teksterForSteg.deltBosted.feilmelding,
        skalSkjules:
            !andreForelder ||
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
        flettefelter: { barnetsNavn: gjeldendeBarn.navn },
    });

    const { kanSendeSkjema, skjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnetFeltTyper,
        string
    >({
        felter: {
            utbetaltForeldrepengerEllerEngangsstønad,
            barnRegistrerteUtenlandsperioder,
            planleggerÅBoINorge12Mnd,
            pågåendeSøknadFraAnnetEøsLand,
            pågåendeSøknadHvilketLand,
            mottarEllerMottokEøsKontantstøtte,
            registrerteEøsKontantstøttePerioder,
            registrerteBarnehageplassPerioder,
            andreForelderNavn,
            andreForelderKanIkkeGiOpplysninger,
            andreForelderFnr,
            andreForelderFnrUkjent,
            andreForelderFødselsdato,
            andreForelderFødselsdatoUkjent,
            andreForelderYrkesaktivFemÅr,
            andreForelderArbeidUtlandet,
            andreForelderArbeidsperioderUtland,
            andreForelderPensjonUtland,
            andreForelderPensjonsperioderUtland,
            borFastMedSøker,
            foreldreBorSammen,
            søkerDeltKontantstøtte,
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
                yrkesaktivFemÅr: {
                    ...andreForelder[andreForelderDataKeySpørsmål.yrkesaktivFemÅr],
                    svar: andreForelderYrkesaktivFemÅr.verdi,
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
        const utenlandsperioder = barnRegistrerteUtenlandsperioder.verdi;

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
            utbetaltForeldrepengerEllerEngangsstønad: {
                ...barn.utbetaltForeldrepengerEllerEngangsstønad,
                svar: utbetaltForeldrepengerEllerEngangsstønad.verdi,
            },
            planleggerÅBoINorge12Mnd: {
                ...barn.planleggerÅBoINorge12Mnd,
                svar: !flyttetPermanentFraNorge(utenlandsperioder)
                    ? planleggerÅBoINorge12Mnd.verdi
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
            barnehageplassPerioder: skalFeltetVises(barnDataKeySpørsmål.harBarnehageplass)
                ? registrerteBarnehageplassPerioder.verdi
                : [],
            borFastMedSøker: {
                ...barn.borFastMedSøker,
                svar: borFastMedSøker.verdi,
            },
            foreldreBorSammen: {
                ...barn.foreldreBorSammen,
                svar: foreldreBorSammen.erSynlig ? foreldreBorSammen.verdi : null,
            },
            søkerDeltKontantstøtte: {
                ...barn.søkerDeltKontantstøtte,
                svar: søkerDeltKontantstøtte.erSynlig ? søkerDeltKontantstøtte.verdi : null,
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
    }, [andreForelderArbeidUtlandet, andreForelderPensjonUtland, barnRegistrerteUtenlandsperioder]);

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
        leggTilUtenlandsperiodeBarn,
        fjernUtenlandsperiodeBarn,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilKontantstøttePeriode,
        fjernKontantstøttePeriode,
        leggTilBarnehageplassPeriode,
        fjernBarnehageplassPeriode,
    };
};
