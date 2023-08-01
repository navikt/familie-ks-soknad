import { IBarnMedISøknad } from '../../typer/barn';
import { Slektsforhold, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IOmsorgspersonIKontraktFormat } from '../../typer/kontrakt/søknadKontrakt';
import { IOmsorgsperson } from '../../typer/omsorgsperson';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { hentSlektsforhold, landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsKontantstøttePeriodeIKontraktFormat } from './eøsKontantstøttePeriode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltForESvarHof,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const omsorgspersonTilISøknadsfelt = (
    omsorgsperson: IOmsorgsperson,
    barn: IBarnMedISøknad,
    tilRestLocaleRecord: TilRestLocaleRecord,
    tekster: ITekstinnhold
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
    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const eøsTekster = tekster.EØS_FOR_BARN;
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);
    const flettefelter = { barnetsNavn: barn.navn };

    return {
        navn: søknadsfelt(
            eøsTekster.hvaHeterOmsorgspersonen.sporsmal,
            sammeVerdiAlleSpråk(navn.svar)
        ),
        slektsforhold: slektsforhold.svar
            ? søknadsfelt(
                  eøsTekster.slektsforholdOmsorgsperson.sporsmal,
                  tilRestLocaleRecord(
                      hentSlektsforhold(slektsforhold.svar as Slektsforhold, eøsTekster)
                  ),
                  flettefelter
              )
            : null,
        slektsforholdSpesifisering: slektsforholdSpesifisering.svar
            ? søknadsfelt(
                  eøsTekster.hvilkenRelasjonOmsorgsperson.sporsmal,
                  sammeVerdiAlleSpråk(slektsforholdSpesifisering.svar),
                  flettefelter
              )
            : null,
        idNummer: søknadsfelt(
            eøsTekster.idNummerOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråkEllerUkjent(
                tilRestLocaleRecord,
                idNummer.svar,
                eøsTekster.idNummerOmsorgsperson.checkboxLabel
            )
        ),
        adresse: søknadsfelt(
            eøsTekster.hvorBorOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråkEllerUkjent(
                tilRestLocaleRecord,
                adresse.svar,
                eøsTekster.hvorBorOmsorgsperson.checkboxLabel
            )
        ),
        arbeidUtland: søknadsfeltForESvar(
            eøsTekster.arbeidUtenforNorgeOmsorgsperson.sporsmal,
            arbeidUtland.svar,
            flettefelter
        ),
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.omsorgsperson,
                barn,
            })
        ),
        arbeidNorge: søknadsfeltForESvar(
            eøsTekster.arbeidNorgeOmsorgsperson.sporsmal,
            arbeidNorge.svar,
            flettefelter
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.omsorgsperson,
                barn,
            })
        ),
        pensjonUtland: søknadsfeltForESvar(
            eøsTekster.pensjonUtlandOmsorgsperson.sporsmal,
            pensjonUtland.svar,
            flettefelter
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.omsorgsperson,
                barn: barn,
            })
        ),
        pensjonNorge: søknadsfeltForESvar(
            eøsTekster.pensjonNorgeOmsorgsperson.sporsmal,
            pensjonNorge.svar,
            flettefelter
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.omsorgsperson,
                barn: barn,
            })
        ),
        andreUtbetalinger: søknadsfeltForESvar(
            eøsTekster.utbetalingerOmsorgsperson.sporsmal,
            andreUtbetalinger.svar,
            flettefelter
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.andreUtbetalinger.omsorgsperson,
                barn,
            })
        ),
        pågåendeSøknadFraAnnetEøsLand: søknadsfeltForESvar(
            eøsTekster.paagaaendeSoeknadYtelseOmsorgsperson.sporsmal,
            pågåendeSøknadFraAnnetEøsLand.svar,
            flettefelter
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfelt(
                  eøsTekster.hvilketLandSoektYtelseOmsorgsperson.sporsmal,
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  ),
                  flettefelter
              )
            : null,
        kontantstøtteFraEøs: søknadsfeltForESvar(
            eøsTekster.ytelseFraAnnetLandOmsorgsperson.sporsmal,
            kontantstøtteFraEøs.svar,
            flettefelter
        ),
        eøsKontantstøttePerioder: eøsKontantstøttePerioder.map((periode, index) =>
            tilIEøsKontantstøttePeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                eøsYtelseTekster: tekster.FELLES.modaler.eøsYtelse.omsorgsperson,
                barn: barn,
            })
        ),
    };
};
