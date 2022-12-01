import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { idNummerLandMedPeriodeType } from '../components/SøknadsSteg/EøsSteg/idnummerUtils';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../typer/barn';
import { tomString } from '../typer/common';
import { PlainTekst } from '../typer/kontrakt/generelle';
import { IEøsKontantstøttePeriode, IUtenlandsperiode } from '../typer/perioder';
import { IBarn, IBarnRespons, IIdNummer } from '../typer/person';
import { IFrittståendeOrdTekstinnhold } from '../typer/sanity/tekstInnhold';
import { ISøknad } from '../typer/søknad';
import { formaterFnr } from './visning';

export const genererInitiellAndreForelder = (
    andreForelder: IAndreForelder | null,
    andreForelderErDød: boolean
): IAndreForelder => {
    return {
        kanIkkeGiOpplysninger: {
            id: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
            svar: andreForelder?.kanIkkeGiOpplysninger.svar ?? ESvar.NEI,
        },
        arbeidsperioderNorge: andreForelder?.arbeidsperioderNorge ?? [],
        arbeidsperioderUtland: andreForelder?.arbeidsperioderUtland ?? [],
        andreUtbetalingsperioder: andreForelder?.andreUtbetalingsperioder ?? [],
        pensjonsperioderNorge: andreForelder?.pensjonsperioderNorge ?? [],
        pensjonsperioderUtland: andreForelder?.pensjonsperioderUtland ?? [],
        eøsKontantstøttePerioder: andreForelder?.eøsKontantstøttePerioder ?? [],
        idNummer: andreForelder?.idNummer ?? [],
        navn: {
            id: OmBarnetSpørsmålsId.andreForelderNavn,
            svar: andreForelder?.navn.svar ?? '',
        },
        fnr: {
            id: OmBarnetSpørsmålsId.andreForelderFnr,
            svar: andreForelder?.fnr.svar ?? '',
        },
        fødselsdato: {
            id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
            svar: andreForelder?.fødselsdato.svar ?? '',
        },
        yrkesaktivFemÅr: {
            svar: andreForelder?.yrkesaktivFemÅr.svar ?? null,
            id: OmBarnetSpørsmålsId.andreForelderYrkesaktivFemÅr,
        },
        arbeidUtlandet: {
            svar: andreForelder?.arbeidUtlandet.svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke
                : OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
        },
        pensjonUtland: {
            svar: andreForelder?.pensjonUtland.svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                : OmBarnetSpørsmålsId.andreForelderPensjonUtland,
        },
        skriftligAvtaleOmDeltBosted: {
            id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
            svar:
                andreForelder && !andreForelderErDød
                    ? andreForelder.skriftligAvtaleOmDeltBosted.svar
                    : null,
        },
        arbeidNorge: {
            svar: andreForelder?.arbeidNorge.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke
                : EøsBarnSpørsmålId.andreForelderArbeidNorge,
        },
        pensjonNorge: {
            svar: andreForelder?.pensjonNorge.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke
                : EøsBarnSpørsmålId.andreForelderPensjonNorge,
        },
        andreUtbetalinger: {
            svar: andreForelder?.andreUtbetalinger.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke
                : EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
        },
        adresse: {
            svar: andreForelder?.adresse.svar ?? '',
            id: EøsBarnSpørsmålId.andreForelderAdresse,
        },
        pågåendeSøknadFraAnnetEøsLand: {
            svar:
                andreForelder?.pågåendeSøknadFraAnnetEøsLand.svar && !andreForelderErDød
                    ? andreForelder?.pågåendeSøknadFraAnnetEøsLand.svar
                    : null,
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
        },
        pågåendeSøknadHvilketLand: {
            svar:
                andreForelder?.pågåendeSøknadHvilketLand.svar && !andreForelderErDød
                    ? andreForelder?.pågåendeSøknadHvilketLand.svar
                    : '',
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
        },
        kontantstøtteFraEøs: {
            svar: andreForelder?.kontantstøtteFraEøs.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderKontantstøtteGjenlevende
                : EøsBarnSpørsmålId.andreForelderKontantstøtte,
        },
    };
};

export const hentAlder = (dato: string): string => {
    const idag = new Date();
    const fødselsdato = new Date(dato);
    let alder = idag.getFullYear() - fødselsdato.getFullYear();
    const månedDiff = idag.getMonth() - fødselsdato.getMonth();
    if (månedDiff < 0 || (månedDiff === 0 && idag.getDate() < fødselsdato.getDate())) {
        alder--;
    }
    return alder.toString();
};

export const erBarnRegistrertFraFør = (søknad: ISøknad, ident: string) => {
    const barnFraPdl = søknad.søker.barn.find(barn => barn.ident === ident);
    const barnRegistrertManuelt = søknad.barnRegistrertManuelt.find(barn => barn.ident === ident);
    return barnFraPdl || barnRegistrertManuelt;
};

export const genererInitialBarnMedISøknad = (barn: IBarn): IBarnMedISøknad => {
    return {
        ...barn,
        barnErFyltUt: false,
        utenlandsperioder: [],
        eøsKontantstøttePerioder: [],
        barnehageplassPerioder: [],
        idNummer: [],
        andreForelder: null,
        omsorgsperson: null,
        triggetEøs: false,
        [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: {
            id: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
            svar: null,
        },
        [barnDataKeySpørsmål.erFosterbarn]: {
            id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
            svar: null,
        },
        [barnDataKeySpørsmål.erAdoptert]: {
            id: OmBarnaDineSpørsmålId.hvemErAdoptert,
            svar: null,
        },
        [barnDataKeySpørsmål.erAsylsøker]: {
            id: OmBarnaDineSpørsmålId.hvemErSøktAsylFor,
            svar: null,
        },
        [barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland]: {
            id: OmBarnaDineSpørsmålId.hvemKontantstøtteFraAnnetEøsland,
            svar: null,
        },
        [barnDataKeySpørsmål.harBarnehageplass]: {
            id: OmBarnaDineSpørsmålId.hvemBarnehageplass,
            svar: null,
        },
        [barnDataKeySpørsmål.andreForelderErDød]: {
            id: OmBarnaDineSpørsmålId.hvemAvdødPartner,
            svar: null,
        },
        [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
            id: OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon,
            svar: null,
        },
        [barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad]: {
            id: OmBarnetSpørsmålsId.utbetaltForeldrepengerEllerEngangsstønad,
            svar: null,
        },
        [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
            id: OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge,
            svar: null,
        },
        [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
            id: OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd,
            svar: null,
        },
        [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
            id: OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand,
            svar: null,
        },
        [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
            id: OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte]: {
            id: OmBarnetSpørsmålsId.mottarEllerMottokEøsKontantstøtte,
            svar: null,
        },
        [barnDataKeySpørsmål.borFastMedSøker]: {
            id: OmBarnetSpørsmålsId.borFastMedSøker,
            svar: null,
        },
        [barnDataKeySpørsmål.søkersSlektsforhold]: {
            id: EøsBarnSpørsmålId.søkersSlektsforhold,
            svar: '',
        },
        [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: {
            id: EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering,
            svar: '',
        },
        [barnDataKeySpørsmål.borMedAndreForelder]: {
            id: EøsBarnSpørsmålId.borMedAndreForelder,
            svar: null,
        },
        [barnDataKeySpørsmål.borMedOmsorgsperson]: {
            id: EøsBarnSpørsmålId.borMedOmsorgsperson,
            svar: null,
        },
        [barnDataKeySpørsmål.adresse]: {
            id: EøsBarnSpørsmålId.barnetsAdresse,
            svar: '',
        },
    };
};

export const hentUid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const mapBarnResponsTilBarn = (
    barn: IBarnRespons[],
    tekster: IFrittståendeOrdTekstinnhold,
    plainTekst: PlainTekst
): IBarn[] => {
    return barn.map(barnRespons => ({
        id: hentUid(),
        navn: barnetsNavnValue(barnRespons, tekster, plainTekst),
        ident: barnRespons.ident,
        alder: barnRespons.fødselsdato ? hentAlder(barnRespons.fødselsdato) : null,
        borMedSøker: barnRespons.borMedSøker,
        adressebeskyttelse: barnRespons.adressebeskyttelse,
    }));
};

export const barnetsNavnValue = (
    barn: IBarnRespons,
    tekster: IFrittståendeOrdTekstinnhold,
    plainTekst: PlainTekst
): string => {
    return barn.navn
        ? barn.navn
        : `${plainTekst(tekster.barn).toUpperCase()} ${formaterFnr(barn.ident)}`;
};

export const skalSkjuleAndreForelderFelt = (barn: IBarnMedISøknad) => {
    return (
        barn.andreForelder?.kanIkkeGiOpplysninger.svar === ESvar.JA ||
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA
    );
};

export const skalSpørreOmIdNummerForPågåendeSøknadEøsLand = (
    barn: IBarnMedISøknad,
    erEøsLand: (land: Alpha3Code | '') => boolean
): boolean => {
    return (
        barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar !== '' &&
        !idNummerLandMedPeriodeType(
            {
                utenlandsperioder: barn.utenlandsperioder,
                eøsKontantstøttePerioder: barn.eøsKontantstøttePerioder,
            },
            erEøsLand
        )
            .map(landMedPeriode => landMedPeriode.land)
            .includes(barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar)
    );
};

export const filtrerteRelevanteIdNummerForBarn = (
    perioder: {
        eøsKontantstøttePerioder: IEøsKontantstøttePeriode[];
        utenlandsperioder: IUtenlandsperiode[];
    },
    pågåendeSøknadFraAnnetEøsLand: ESvar | null,
    pågåendeSøknadHvilketLand: Alpha3Code | '',
    barn: IBarnMedISøknad,
    erEøsLand: (land: Alpha3Code | '') => boolean
): IIdNummer[] => {
    const relevanteLandForPerioder = idNummerLandMedPeriodeType(
        {
            eøsKontantstøttePerioder: perioder.eøsKontantstøttePerioder,
            utenlandsperioder: perioder.utenlandsperioder,
        },
        erEøsLand
    ).map(landMedPeriode => landMedPeriode.land);

    const inkluderPågåendeSøknadIAnnetLand =
        pågåendeSøknadFraAnnetEøsLand === ESvar.JA &&
        pågåendeSøknadHvilketLand !== '' &&
        !relevanteLandForPerioder.includes(pågåendeSøknadHvilketLand);

    const relevanteLand = inkluderPågåendeSøknadIAnnetLand
        ? relevanteLandForPerioder.concat(pågåendeSøknadHvilketLand)
        : relevanteLandForPerioder;

    return barn.idNummer.filter(idNummerObj => relevanteLand.includes(idNummerObj.land));
};

export const nullstilteEøsFelterForAndreForelder = (
    andreForelder: IAndreForelder
): IAndreForelder => ({
    ...andreForelder,
    idNummer: [],
    pensjonNorge: {
        ...andreForelder.pensjonNorge,
        svar: null,
    },
    arbeidNorge: {
        ...andreForelder.arbeidNorge,
        svar: null,
    },
    andreUtbetalinger: {
        ...andreForelder.andreUtbetalinger,
        svar: null,
    },
    pågåendeSøknadFraAnnetEøsLand: {
        ...andreForelder.pågåendeSøknadFraAnnetEøsLand,
        svar: null,
    },
    pågåendeSøknadHvilketLand: {
        ...andreForelder.pågåendeSøknadHvilketLand,
        svar: '',
    },
    kontantstøtteFraEøs: {
        ...andreForelder.kontantstøtteFraEøs,
        svar: null,
    },
    pensjonsperioderNorge: [],
    arbeidsperioderNorge: [],
    andreUtbetalingsperioder: [],
    eøsKontantstøttePerioder: [],
    adresse: { ...andreForelder.adresse, svar: '' },
});

export const nullstilteEøsFelterForBarn = (barn: IBarnMedISøknad) => ({
    idNummer: [],
    søkersSlektsforhold: { ...barn.søkersSlektsforhold, svar: tomString },
    søkersSlektsforholdSpesifisering: {
        ...barn.søkersSlektsforholdSpesifisering,
        svar: '',
    },
    borMedAndreForelder: { ...barn.borMedAndreForelder, svar: null },
    borMedOmsorgsperson: { ...barn.borMedOmsorgsperson, svar: null },
    omsorgsperson: null,
    adresse: { ...barn.adresse, svar: '' },
    ...(barn.andreForelder && {
        andreForelder: nullstilteEøsFelterForAndreForelder(barn.andreForelder),
    }),
});

export const skalViseBorMedOmsorgsperson = (
    borMedAndreForelder: ESvar | null,
    borFastMedSøker: ESvar | null,
    oppholderSegIInstitusjon: ESvar | null,
    andreForelderErDød: ESvar | null,
    erFosterbarn: ESvar | null
) => {
    const andreSituasjonerSomUtløserOmsorgsperson =
        borFastMedSøker === ESvar.NEI &&
        oppholderSegIInstitusjon === ESvar.NEI &&
        (andreForelderErDød === ESvar.JA || erFosterbarn === ESvar.JA);

    return borMedAndreForelder === ESvar.NEI || andreSituasjonerSomUtløserOmsorgsperson;
};
