import { TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontraktSøker } from '../../typer/kontrakt/søknadKontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import {
    nullableSøknadsfeltForESvarHof,
    sammeVerdiAlleSpråk,
    søknadsfeltForESvarHof,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const søkerIKontraktFormat = (
    søknad: ISøknad,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord,
    toggleSpørOmMånedIkkeDato: boolean
): ISøknadKontraktSøker => {
    const { søker, barnInkludertISøknaden } = søknad;
    const {
        navn,
        ident,
        sivilstand,
        statsborgerskap,
        adresse,
        adressebeskyttelse,
        borPåRegistrertAdresse,
        værtINorgeITolvMåneder,
        utenlandsperioder,
        planleggerÅBoINorgeTolvMnd,
        yrkesaktivFemÅr,
        erAsylsøker,
        arbeidIUtlandet,
        arbeidsperioderUtland,
        mottarUtenlandspensjon,
        pensjonsperioderUtland,
        arbeidINorge,
        arbeidsperioderNorge,
        pensjonNorge,
        pensjonsperioderNorge,
        andreUtbetalinger,
        andreUtbetalingsperioder,
        idNummer,
        adresseISøkeperiode,
        triggetEøs,
        utenlandsoppholdUtenArbeid,
    } = søker;
    const fellesTekster = tekster.FELLES;
    const omDegTekster = tekster.OM_DEG;
    const dinLivssituasjonTekster = tekster.DIN_LIVSSITUASJON;
    const eøsTekster = tekster.EØS_FOR_SØKER;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);
    const nullableSøknadsfeltForESvar = nullableSøknadsfeltForESvarHof(tilRestLocaleRecord);

    return {
        harEøsSteg: triggetEøs || !!barnInkludertISøknaden.filter(barn => barn.triggetEøs).length,
        navn: søknadsfelt(omDegTekster.navn, sammeVerdiAlleSpråk(navn)),
        ident: søknadsfelt(omDegTekster.ident, sammeVerdiAlleSpråk(ident)),
        sivilstand: søknadsfelt(omDegTekster.sivilstatus, sammeVerdiAlleSpråk(sivilstand.type)),
        statsborgerskap: søknadsfelt(
            omDegTekster.statsborgerskap,
            verdiCallbackAlleSpråk(locale =>
                statsborgerskap.map(objekt => landkodeTilSpråk(objekt.landkode, locale))
            )
        ),
        adresse: søknadsfelt(omDegTekster.adresse, sammeVerdiAlleSpråk(adresse)),
        adressebeskyttelse: adressebeskyttelse,
        borPåRegistrertAdresse: nullableSøknadsfeltForESvar(
            omDegTekster.borPaaAdressen.sporsmal,
            borPåRegistrertAdresse.svar
        ),
        værtINorgeITolvMåneder: søknadsfeltForESvar(
            omDegTekster.oppholdtDegSammenhengende.sporsmal,
            værtINorgeITolvMåneder.svar
        ),
        planleggerÅBoINorgeTolvMnd: søknadsfeltForESvar(
            omDegTekster.planleggerAaBoSammenhengende.sporsmal,
            planleggerÅBoINorgeTolvMnd.svar
        ),
        yrkesaktivFemÅr: søknadsfeltForESvar(
            omDegTekster.medlemAvFolketrygden.sporsmal,
            yrkesaktivFemÅr.svar
        ),
        erAsylsøker: søknadsfeltForESvar(
            dinLivssituasjonTekster.asylsoeker.sporsmal,
            erAsylsøker.svar
        ),
        arbeidIUtlandet: søknadsfeltForESvar(
            dinLivssituasjonTekster.arbeidUtenforNorge.sporsmal,
            arbeidIUtlandet.svar
        ),
        utenlandsoppholdUtenArbeid: søknadsfeltForESvar(
            dinLivssituasjonTekster.utenlandsoppholdUtenArbeid.sporsmal,
            utenlandsoppholdUtenArbeid.svar
        ),
        mottarUtenlandspensjon: søknadsfeltForESvar(
            dinLivssituasjonTekster.pensjonUtland.sporsmal,
            mottarUtenlandspensjon.svar
        ),
        arbeidINorge: nullableSøknadsfeltForESvar(
            eøsTekster.arbeidNorge.sporsmal,
            arbeidINorge.svar
        ),
        pensjonNorge: nullableSøknadsfeltForESvar(
            eøsTekster.pensjonNorge.sporsmal,
            pensjonNorge.svar
        ),
        andreUtbetalinger: nullableSøknadsfeltForESvar(
            eøsTekster.utbetalinger.sporsmal,
            andreUtbetalinger.svar
        ),
        adresseISøkeperiode: adresseISøkeperiode.svar
            ? søknadsfelt(
                  eøsTekster.hvorBor.sporsmal,
                  sammeVerdiAlleSpråk(adresseISøkeperiode.svar)
              )
            : null,
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt({
                utenlandperiode: periode,
                periodeNummer: index + 1,
                tekster: fellesTekster.modaler.utenlandsopphold[PersonType.søker],
                tilRestLocaleRecord,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                tilRestLocaleRecord,
                idnummerObj,
                tekster.EØS_FOR_SØKER.idNummer
            )
        ),
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.søker,
                toggleSpørOmMånedIkkeDato,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.søker,
                toggleSpørOmMånedIkkeDato,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.søker,
                toggleSpørOmMånedIkkeDato,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.søker,
                toggleSpørOmMånedIkkeDato,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.andreUtbetalinger.søker,
                toggleSpørOmMånedIkkeDato,
            })
        ),
    };
};
