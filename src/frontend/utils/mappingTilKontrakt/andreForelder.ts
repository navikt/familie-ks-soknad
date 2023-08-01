import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../../typer/barn';
import { TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IAndreForelderIKontraktFormat } from '../../typer/kontrakt/søknadKontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsKontantstøttePeriodeIKontraktFormat } from './eøsKontantstøttePeriode';
import {
    nullableSøknadsfeltForESvarHof,
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const andreForelderTilISøknadsfelt = (
    andreForelder: IAndreForelder,
    barn: IBarnMedISøknad,
    tilRestLocaleRecord: TilRestLocaleRecord,
    tekster: ITekstinnhold
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
        utenlandsoppholdUtenArbeid,
        utenlandsperioder,
    } = andreForelder;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const nullableSøknadsfeltForESvar = nullableSøknadsfeltForESvarHof(tilRestLocaleRecord);

    const eøsTekster = tekster.EØS_FOR_BARN;
    const omBarnetTekster = tekster.OM_BARNET;
    const flettefelter = { barnetsNavn: barn.navn };

    const erForelderDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;

    return {
        kanIkkeGiOpplysninger: søknadsfelt(
            omBarnetTekster.navnAndreForelder.checkboxLabel,
            sammeVerdiAlleSpråk(kanIkkeGiOpplysninger.svar)
        ),
        navn: navn.svar
            ? søknadsfelt(
                  omBarnetTekster.navnAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      navn.svar,
                      omBarnetTekster.navnAndreForelder.checkboxLabel
                  )
              )
            : null,
        fnr: fnr.svar
            ? søknadsfelt(
                  omBarnetTekster.foedselsnummerDnummerAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      fnr.svar,
                      omBarnetTekster.foedselsnummerDnummerAndreForelder.checkboxLabel
                  )
              )
            : null,
        fødselsdato: fødselsdato.svar
            ? søknadsfelt(
                  omBarnetTekster.foedselsdatoAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      fødselsdato.svar,
                      omBarnetTekster.foedselsdatoAndreForelder.checkboxLabel
                  )
              )
            : null,
        yrkesaktivFemÅr: nullableSøknadsfeltForESvar(
            omBarnetTekster.medlemAvFolktetrygdenAndreForelder.sporsmal,
            yrkesaktivFemÅr.svar,
            flettefelter
        ),
        pensjonUtland: nullableSøknadsfeltForESvar(
            erForelderDød
                ? omBarnetTekster.pensjonUtlandAndreForelderGjenlevende.sporsmal
                : omBarnetTekster.pensjonUtlandAndreForelder.sporsmal,
            pensjonUtland.svar,
            flettefelter
        ),
        arbeidUtlandet: nullableSøknadsfeltForESvar(
            erForelderDød
                ? omBarnetTekster.arbeidUtenforNorgeAndreForelderGjenlevende.sporsmal
                : omBarnetTekster.arbeidUtenforNorgeAndreForelder.sporsmal,
            arbeidUtlandet.svar,
            flettefelter
        ),
        utenlandsoppholdUtenArbeid: nullableSøknadsfeltForESvar(
            omBarnetTekster.utenlandsoppholdUtenArbeidAndreForelder.sporsmal,
            utenlandsoppholdUtenArbeid.svar,
            flettefelter
        ),
        pensjonNorge: nullableSøknadsfeltForESvar(
            erForelderDød
                ? eøsTekster.pensjonNorgeAndreForelderGjenlevende.sporsmal
                : eøsTekster.pensjonNorgeAndreForelder.sporsmal,
            pensjonNorge.svar,
            flettefelter
        ),
        arbeidNorge: nullableSøknadsfeltForESvar(
            erForelderDød
                ? eøsTekster.arbeidNorgeAndreForelderGjenlevende.sporsmal
                : eøsTekster.arbeidNorgeAndreForelder.sporsmal,
            arbeidNorge.svar,
            flettefelter
        ),
        andreUtbetalinger: nullableSøknadsfeltForESvar(
            erForelderDød
                ? eøsTekster.utbetalingerAndreForelderGjenlevende.sporsmal
                : eøsTekster.utbetalingerAndreForelder.sporsmal,
            andreUtbetalinger.svar,
            flettefelter
        ),
        pågåendeSøknadFraAnnetEøsLand: nullableSøknadsfeltForESvar(
            eøsTekster.paagaaendeSoeknadYtelseAndreForelder.sporsmal,
            pågåendeSøknadFraAnnetEøsLand.svar,
            flettefelter
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfelt(
                  eøsTekster.hvilketLandSoektYtelseAndreForelder.sporsmal,
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  ),
                  flettefelter
              )
            : null,
        kontantstøtteFraEøs: nullableSøknadsfeltForESvar(
            erForelderDød
                ? eøsTekster.ytelseFraAnnetLandAndreForelderGjenlevende.sporsmal
                : eøsTekster.ytelseFraAnnetLandAndreForelder.sporsmal,
            kontantstøtteFraEøs.svar,
            flettefelter
        ),
        adresse: adresse.svar
            ? søknadsfelt(
                  eøsTekster.hvorBorAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      adresse.svar,
                      eøsTekster.hvorBorAndreForelder.checkboxLabel
                  ),
                  flettefelter
              )
            : null,
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.andreForelder,
                barn,
            })
        ),
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt({
                utenlandperiode: periode,
                periodeNummer: index + 1,
                tekster: tekster.FELLES.modaler.utenlandsopphold[PersonType.andreForelder],
                tilRestLocaleRecord,
                barn,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.andreForelder,
                barn,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.andreForelder,
                barn,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.andreForelder,
                barn,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.andreUtbetalinger.andreForelder,
                barn,
            })
        ),
        eøsKontantstøttePerioder: eøsKontantstøttePerioder.map((periode, index) =>
            tilIEøsKontantstøttePeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                barn,
                tilRestLocaleRecord,
                eøsYtelseTekster: tekster.FELLES.modaler.eøsYtelse.andreForelder,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                tilRestLocaleRecord,
                idnummerObj,
                tekster.EØS_FOR_BARN.idNummerAndreForelder,
                barn.navn
            )
        ),
    };
};
