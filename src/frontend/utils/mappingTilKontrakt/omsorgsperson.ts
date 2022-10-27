import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { Slektsforhold } from '../../typer/kontrakt/generelle';
import { IOmsorgspersonIKontraktFormat } from '../../typer/kontrakt/v1';
import { IOmsorgsperson } from '../../typer/omsorgsperson';
import { PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk, toSlektsforholdSpråkId } from '../språk';
import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsKontantstøttePeriodeIKontraktFormat } from './eøsKontantstøttePeriode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekstGammel,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const omsorgspersonTilISøknadsfelt = (
    omsorgsperson: IOmsorgsperson,
    barn: IBarnMedISøknad
): IOmsorgspersonIKontraktFormat => {
    const {
        navn,
        slektsforhold,
        slektsforholdSpesifisering,
        idNummer,
        adresse,
        arbeidUtland,
        arbeidsperioderUtland,
        arbeidNorge,
        arbeidsperioderNorge,
        pensjonUtland,
        pensjonsperioderUtland,
        pensjonNorge,
        pensjonsperioderNorge,
        pågåendeSøknadFraAnnetEøsLand,
        pågåendeSøknadHvilketLand,
        kontantstøtteFraEøs,
        eøsKontantstøttePerioder,
        andreUtbetalinger,
        andreUtbetalingsperioder,
    } = omsorgsperson;

    if (
        !arbeidUtland.svar ||
        !arbeidNorge.svar ||
        !pensjonUtland.svar ||
        !pensjonNorge.svar ||
        !kontantstøtteFraEøs.svar ||
        !pågåendeSøknadFraAnnetEøsLand.svar ||
        !andreUtbetalinger.svar
    ) {
        throw new TypeError('Omsorgspersonfelter mangler');
    }

    return {
        navn: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonNavn),
            sammeVerdiAlleSpråk(navn.svar),
            barn
        ),
        slektsforhold: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforhold),
            hentTekster(toSlektsforholdSpråkId(slektsforhold.svar as Slektsforhold)),
            barn
        ),
        slektsforholdSpesifisering: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering),
            sammeVerdiAlleSpråk(slektsforholdSpesifisering.svar),
            barn
        ),
        idNummer: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonIdNummer),
            sammeVerdiAlleSpråkEllerUkjentSpråktekstGammel(
                idNummer.svar,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke]
            ),
            barn
        ),
        adresse: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonAdresse),
            sammeVerdiAlleSpråk(adresse.svar),
            barn
        ),
        arbeidUtland: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonArbeidUtland),
            sammeVerdiAlleSpråk(arbeidUtland.svar),
            barn
        ),
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.omsorgsperson,
            })
        ),
        arbeidNorge: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonArbeidNorge),
            sammeVerdiAlleSpråk(arbeidNorge.svar),
            barn
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.omsorgsperson,
            })
        ),
        pensjonUtland: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonPensjonUtland),
            sammeVerdiAlleSpråk(pensjonUtland.svar),
            barn
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.omsorgsperson,
                barn: barn,
            })
        ),
        pensjonNorge: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonPensjonNorge),
            sammeVerdiAlleSpråk(pensjonNorge.svar),
            barn
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.omsorgsperson,
                barn: barn,
            })
        ),
        andreUtbetalinger: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonAndreUtbetalinger),
            sammeVerdiAlleSpråk(andreUtbetalinger.svar),
            barn
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.omsorgsperson,
                barn,
            })
        ),
        pågåendeSøknadFraAnnetEøsLand: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadFraAnnetEøsLand),
            sammeVerdiAlleSpråk(pågåendeSøknadFraAnnetEøsLand.svar),
            barn
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(
                      EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadHvilketLand
                  ),
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  ),
                  barn
              )
            : null,
        kontantstøtteFraEøs: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonKontantstøtte),
            sammeVerdiAlleSpråk(kontantstøtteFraEøs.svar),
            barn
        ),
        eøsKontantstøttePerioder: eøsKontantstøttePerioder.map((periode, index) =>
            tilIEøsKontantstøttePeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.omsorgsperson,
                barn: barn,
            })
        ),
    };
};
