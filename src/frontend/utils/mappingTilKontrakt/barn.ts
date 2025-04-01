import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { LocaleRecordBlock, LocaleRecordString } from '../../typer/common';
import {
    ERegistrertBostedType,
    Slektsforhold,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { ISøknadIKontraktBarn } from '../../typer/kontrakt/søknadKontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { hentSlektsforhold, landkodeTilSpråk } from '../språk';

import { andreForelderTilISøknadsfelt } from './andreForelder';
import { tilIBarnehageplassPeriodeIKontraktFormat } from './barnehageplassperioder';
import { tilIEøsKontantstøttePeriodeIKontraktFormat } from './eøsKontantstøttePeriode';
import {
    nullableSøknadsfeltForESvarHof,
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltForESvarHof,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { omsorgspersonTilISøknadsfelt } from './omsorgsperson';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const barnISøknadsFormat = (
    barn: IBarnMedISøknad,
    søknad: ISøknad,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord,
    toggleSpørOmMånedIkkeDato: boolean
): ISøknadIKontraktBarn => {
    const {
        ident,
        navn,
        borMedSøker,
        alder,
        adressebeskyttelse,
        andreForelder,
        omsorgsperson,
        utenlandsperioder,
        eøsKontantstøttePerioder,
        barnehageplassPerioder,
        idNummer,
        triggetEøs,
        adresse,
        erFosterbarn,
        oppholderSegIInstitusjon,
        erAdoptert,
        erAsylsøker,
        boddMindreEnn12MndINorge,
        kontantstøtteFraAnnetEøsland,
        harBarnehageplass,
        andreForelderErDød,
        utbetaltForeldrepengerEllerEngangsstønad,
        mottarEllerMottokEøsKontantstøtte,
        pågåendeSøknadFraAnnetEøsLand,
        pågåendeSøknadHvilketLand,
        planleggerÅBoINorge12Mnd,
        borFastMedSøker,
        søkersSlektsforhold,
        søkersSlektsforholdSpesifisering,
        borMedAndreForelder,
        borMedOmsorgsperson,
        foreldreBorSammen,
        søkerDeltKontantstøtte,
    } = barn;
    const fellesTekster = tekster.FELLES;
    const eøsTekster = tekster.EØS_FOR_BARN;
    const omBarnaTekster = tekster.OM_BARNA;
    const omBarnetTekster = tekster.OM_BARNET;
    const leggTilBarnModalTekster = tekster.FELLES.modaler.leggTilBarn;
    const velgBarnTekster = tekster.VELG_BARN;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);
    const nullableSøknadsfeltForESvar = nullableSøknadsfeltForESvarHof(tilRestLocaleRecord);

    const registertBostedVerdi = (): ERegistrertBostedType => {
        /**
         * 4 caser:
         *
         * 1. Adressesperre
         * 2. Manuelt registrert, "Ikke fylt inn"
         * 3. Bor med søker "registrert på søkers adresse"
         * 4. Bor ikke med søker "registrert på annen adresse"
         */
        if (adressebeskyttelse) {
            return ERegistrertBostedType.ADRESSESPERRE;
        }

        switch (borMedSøker) {
            case undefined:
                return ERegistrertBostedType.IKKE_FYLT_INN;
            case true:
                return ERegistrertBostedType.REGISTRERT_SOKERS_ADRESSE;
            case false:
                return ERegistrertBostedType.REGISTRERT_ANNEN_ADRESSE;
            default:
                return ERegistrertBostedType.IKKE_FYLT_INN;
        }
    };

    const flettefelter = { barnetsNavn: barn.navn };

    return {
        harEøsSteg: triggetEøs || søknad.søker.triggetEøs,
        navn: søknadsfelt(leggTilBarnModalTekster.barnetsNavnSubtittel, sammeVerdiAlleSpråk(navn)),
        ident: søknadsfelt(velgBarnTekster.foedselsnummerLabel, sammeVerdiAlleSpråk(ident)),
        registrertBostedType: søknadsfelt(
            velgBarnTekster.registrertBostedLabel,
            sammeVerdiAlleSpråk(registertBostedVerdi())
        ),
        alder: alder ? søknadsfelt(velgBarnTekster.alderLabel, sammeVerdiAlleSpråk(alder)) : null,
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt({
                utenlandperiode: periode,
                periodeNummer: index + 1,
                tekster: fellesTekster.modaler.utenlandsopphold[PersonType.barn],
                tilRestLocaleRecord,
            })
        ),
        eøsKontantstøttePerioder: eøsKontantstøttePerioder.map((periode, index) =>
            tilIEøsKontantstøttePeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                barn,
                tilRestLocaleRecord,
                eøsYtelseTekster: tekster.FELLES.modaler.eøsYtelse.søker,
                toggleSpørOmMånedIkkeDato,
            })
        ),
        barnehageplassPerioder: barnehageplassPerioder.map((periode, index) =>
            tilIBarnehageplassPeriodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                barnehageplassTekster: tekster.FELLES.modaler.barnehageplass,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                tilRestLocaleRecord,
                idnummerObj,
                tekster.EØS_FOR_BARN.idNummerBarn,
                navn
            )
        ),
        andreForelder: andreForelder
            ? andreForelderTilISøknadsfelt(
                  andreForelder,
                  barn,
                  tilRestLocaleRecord,
                  tekster,
                  toggleSpørOmMånedIkkeDato
              )
            : null,

        omsorgsperson: omsorgsperson
            ? omsorgspersonTilISøknadsfelt(
                  omsorgsperson,
                  barn,
                  tilRestLocaleRecord,
                  tekster,
                  toggleSpørOmMånedIkkeDato
              )
            : null,
        adresse: adresse.svar
            ? søknadsfelt(
                  eøsTekster.hvorBorBarnet.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      adresse.svar,
                      eøsTekster.hvorBorBarnet.checkboxLabel
                  ),
                  flettefelter
              )
            : null,
        erFosterbarn: søknadsfeltForESvar(
            omBarnaTekster.hvemFosterbarn.sporsmal,
            erFosterbarn.svar
        ),
        oppholderSegIInstitusjon: søknadsfeltForESvar(
            omBarnaTekster.hvemInstitusjon.sporsmal,
            oppholderSegIInstitusjon.svar
        ),
        erAdoptert: søknadsfeltForESvar(
            omBarnaTekster.hvemAdoptertKontantstoette.sporsmal,
            erAdoptert.svar
        ),
        erAsylsøker: søknadsfeltForESvar(omBarnaTekster.hvemAsyl.sporsmal, erAsylsøker.svar),
        boddMindreEnn12MndINorge: søknadsfeltForESvar(
            omBarnaTekster.hvemOppholdUtenforNorge.sporsmal,
            boddMindreEnn12MndINorge.svar
        ),
        kontantstøtteFraAnnetEøsland: søknadsfeltForESvar(
            omBarnaTekster.hvemSoektYtelse.sporsmal,
            kontantstøtteFraAnnetEøsland.svar
        ),
        harBarnehageplass: søknadsfeltForESvar(
            omBarnaTekster.hvemBarnehageplass.sporsmal,
            harBarnehageplass.svar
        ),
        andreForelderErDød: nullableSøknadsfeltForESvar(
            søknad.erAvdødPartnerForelder.id ===
                OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                ? omBarnaTekster.hvemAvBarnaAvdoedPartner.sporsmal
                : omBarnaTekster.hvemAvBarnaAvdoedEktefelle.sporsmal,
            andreForelderErDød.svar
        ),
        utbetaltForeldrepengerEllerEngangsstønad: nullableSøknadsfeltForESvar(
            omBarnetTekster.utbetaltForeldrepengerEllerEngangsstoenad.sporsmal,
            utbetaltForeldrepengerEllerEngangsstønad.svar
        ),
        mottarEllerMottokEøsKontantstøtte: nullableSøknadsfeltForESvar(
            omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal,
            mottarEllerMottokEøsKontantstøtte.svar
        ),
        pågåendeSøknadFraAnnetEøsLand: nullableSøknadsfeltForESvar(
            omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
            pågåendeSøknadFraAnnetEøsLand.svar
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfelt(
                  omBarnetTekster.hvilketLandYtelse.sporsmal,
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  )
              )
            : null,
        planleggerÅBoINorge12Mnd: nullableSøknadsfeltForESvar(
            omBarnetTekster.planlagtBoSammenhengendeINorge.sporsmal,
            planleggerÅBoINorge12Mnd.svar,
            flettefelter
        ),
        borFastMedSøker: søknadsfeltForESvar(
            omBarnetTekster.borBarnFastSammenMedDeg.sporsmal,
            borFastMedSøker.svar,
            flettefelter
        ),
        foreldreBorSammen: nullableSøknadsfeltForESvar(
            omBarnetTekster.borForeldreSammen.sporsmal,
            foreldreBorSammen.svar,
            flettefelter
        ),
        søkerDeltKontantstøtte: nullableSøknadsfeltForESvar(
            omBarnetTekster.soekerDeltKontantstoette.sporsmal,
            søkerDeltKontantstøtte.svar,
            flettefelter
        ),
        søkersSlektsforhold: søkersSlektsforhold.svar
            ? søknadsfelt(
                  eøsTekster.slektsforhold.sporsmal,
                  tilRestLocaleRecord(
                      hentSlektsforhold(søkersSlektsforhold.svar as Slektsforhold, eøsTekster)
                  ),
                  flettefelter
              )
            : null,
        søkersSlektsforholdSpesifisering: søkersSlektsforholdSpesifisering.svar
            ? søknadsfelt(
                  eøsTekster.hvilkenRelasjon.sporsmal,
                  sammeVerdiAlleSpråk(søkersSlektsforholdSpesifisering.svar),
                  flettefelter
              )
            : null,
        borMedAndreForelder: nullableSøknadsfeltForESvar(
            eøsTekster.borMedAndreForelder.sporsmal,
            borMedAndreForelder.svar,
            flettefelter
        ),
        borMedOmsorgsperson: nullableSøknadsfeltForESvar(
            eøsTekster.borMedOmsorgsperson.sporsmal,
            borMedOmsorgsperson.svar,
            flettefelter
        ),
        teksterTilPdf: {
            ...[
                tekster.OM_BARNET.opplystAdoptert,
                tekster.OM_BARNET.opplystBarnOppholdUtenforNorge,
                tekster.OM_BARNET.opplystFaarHarFaattEllerSoektYtelse,
                tekster.OM_BARNET.opplystBarnehageplass,
                tekster.OM_BARNET.barnetsAndreForelder,
                tekster.OM_BARNET.omBarnetTittel,
                tekster.OM_BARNET.bosted,
                tekster.EØS_FOR_BARN.eoesForBarnTittel,
            ].reduce(
                (map, sanityDok: LocaleRecordBlock | LocaleRecordString) => ({
                    ...map,
                    [sanityDok.api_navn]: tilRestLocaleRecord(sanityDok, {
                        barnetsNavn: barn.navn,
                    }),
                }),
                {}
            ),
        },
    };
};
