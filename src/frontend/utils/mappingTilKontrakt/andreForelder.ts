import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../../typer/barn';
import { IAndreForelderIKontraktFormat } from '../../typer/kontrakt/v1';
import { PersonType } from '../../typer/personType';
import { landkodeTilSpråk } from '../språk';
import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsKontantstøttePeriodeIKontraktFormat } from './eøsKontantstøttePeriode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const andreForelderTilISøknadsfelt = (
    andreForelder: IAndreForelder,
    barn: IBarnMedISøknad,
    valgtSpråk: LocaleType
): IAndreForelderIKontraktFormat => {
    const {
        navn,
        fnr,
        fødselsdato,
        yrkesaktivFemÅr,
        pensjonUtland,
        arbeidUtlandet,
        pensjonNorge,
        arbeidNorge,
        andreUtbetalinger,
        kontantstøtteFraEøs,
        skriftligAvtaleOmDeltBosted,
        arbeidsperioderUtland,
        pensjonsperioderUtland,
        arbeidsperioderNorge,
        pensjonsperioderNorge,
        andreUtbetalingsperioder,
        pågåendeSøknadFraAnnetEøsLand,
        pågåendeSøknadHvilketLand,
        eøsKontantstøttePerioder,
        idNummer,
        adresse,
        kanIkkeGiOpplysninger,
    } = andreForelder;
    const forelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;
    return {
        kanIkkeGiOpplysninger: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(kanIkkeGiOpplysninger.id),
            sammeVerdiAlleSpråk(kanIkkeGiOpplysninger.svar),
            barn
        ),
        navn: navn.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderNavn),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      navn.svar,
                      omBarnetSpørsmålSpråkId[
                          OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                      ]
                  ),
                  barn
              )
            : null,
        fnr: fnr.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFnr),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      fnr.svar,
                      omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnrUkjent]
                  ),
                  barn
              )
            : null,
        fødselsdato: fødselsdato.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFødselsdato),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      fødselsdato.svar,
                      omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent]
                  ),
                  barn
              )
            : null,
        yrkesaktivFemÅr: yrkesaktivFemÅr.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(yrkesaktivFemÅr.id),
                  sammeVerdiAlleSpråk(yrkesaktivFemÅr.svar)
              )
            : null,
        pensjonUtland: pensjonUtland.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(pensjonUtland.id),
                  sammeVerdiAlleSpråk(pensjonUtland.svar),
                  barn
              )
            : null,
        arbeidUtlandet: arbeidUtlandet.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(arbeidUtlandet.id),
                  sammeVerdiAlleSpråk(arbeidUtlandet.svar),
                  barn
              )
            : null,
        pensjonNorge: pensjonNorge.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(pensjonNorge.id),
                  sammeVerdiAlleSpråk(pensjonNorge.svar),
                  barn
              )
            : null,
        arbeidNorge: arbeidNorge.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(arbeidNorge.id),
                  sammeVerdiAlleSpråk(arbeidNorge.svar),
                  barn
              )
            : null,
        andreUtbetalinger: andreUtbetalinger.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(andreUtbetalinger.id),
                  sammeVerdiAlleSpråk(andreUtbetalinger.svar),
                  barn
              )
            : null,
        pågåendeSøknadFraAnnetEøsLand: pågåendeSøknadFraAnnetEøsLand.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(
                      EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand
                  ),
                  sammeVerdiAlleSpråk(pågåendeSøknadFraAnnetEøsLand.svar),
                  barn
              )
            : null,
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(
                      EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand
                  ),
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  ),
                  barn
              )
            : null,
        kontantstøtteFraEøs: kontantstøtteFraEøs.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(kontantstøtteFraEøs.id),
                  sammeVerdiAlleSpråk(kontantstøtteFraEøs.svar),
                  barn
              )
            : null,
        skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted),
                  sammeVerdiAlleSpråk(skriftligAvtaleOmDeltBosted.svar),
                  barn
              )
            : null,
        adresse: adresse.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.andreForelderAdresse),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      adresse.svar,
                      eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAdresseVetIkke]
                  ),
                  barn
              )
            : null,
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        eøsKontantstøttePerioder: eøsKontantstøttePerioder.map((periode, index) =>
            tilIEøsKontantstøttePeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                idnummerObj,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerAndreForelder],
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent],
                valgtSpråk,
                barn.navn
            )
        ),
    };
};
