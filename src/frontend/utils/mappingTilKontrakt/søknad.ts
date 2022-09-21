import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ESivilstand } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/v1';
import { ISøker } from '../../typer/person';
import { PersonType } from '../../typer/personType';
import { ESanitySivilstandApiKey } from '../../typer/sanity/sanity';
import { IFrittståendeOrdTekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { ISøknad } from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import {
    sivilstandTilSanitySivilstandApiKey,
    hentTekster,
    hentUformaterteTekster,
    landkodeTilSpråk,
} from '../språk';
import { jaNeiSvarTilSpråkId } from '../spørsmål';
import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { barnISøknadsFormat } from './barn';
import { dokumentasjonISøknadFormat } from './dokumentasjon';
import {
    sammeVerdiAlleSpråk,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfelt,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

const antallEøsSteg = (søker: ISøker, barnInkludertISøknaden: IBarnMedISøknad[]) => {
    const barnSomTriggerEøs = barnInkludertISøknaden.filter(barn => barn.triggetEøs);
    if (søker.triggetEøs) {
        return barnInkludertISøknaden.length + 1;
    } else if (barnSomTriggerEøs.length) {
        return barnSomTriggerEøs.length + 1;
    } else {
        return 0;
    }
};

export const dataISøknadKontraktFormatV1 = (
    valgtSpråk: LocaleType,
    søknad: ISøknad,
    frittståendeOrdTekster: IFrittståendeOrdTekstinnhold
): ISøknadKontrakt => {
    const { søker } = søknad;
    // Raskeste måte å få tak i alle spørsmål minus de andre feltene på søker
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        navn,
        ident,
        sivilstand,
        statsborgerskap,
        adresse,
        barn,
        adressebeskyttelse,
        utenlandsperioder,
        // Nye felter under utvikling av EØS full
        andreUtbetalingsperioder,
        arbeidsperioderNorge,
        arbeidsperioderUtland,
        pensjonsperioderNorge,
        pensjonsperioderUtland,
        triggetEøs,
        idNummer,
        // resterende felter, hvor alle må være av type ISøknadSpørsmål
        ...søkerSpørsmål
    } = søker;
    const { barnInkludertISøknaden } = søknad;
    const typetSøkerSpørsmål: ISøknadSpørsmålMap = søkerSpørsmål as unknown as ISøknadSpørsmålMap;

    return {
        kontraktVersjon: 1,
        antallEøsSteg: antallEøsSteg(søker, barnInkludertISøknaden),
        søker: {
            harEøsSteg:
                triggetEøs || !!barnInkludertISøknaden.filter(barn => barn.triggetEøs).length,
            navn: søknadsfelt('pdf.søker.navn.label', sammeVerdiAlleSpråk(navn)),
            ident: søknadsfelt('pdf.søker.ident.label', sammeVerdiAlleSpråk(ident)),
            sivilstand: søknadsfelt(
                'pdf.søker.sivilstand.label',
                sammeVerdiAlleSpråk(sivilstand.type)
            ),
            statsborgerskap: søknadsfelt(
                'pdf.søker.statsborgerskap.label',
                verdiCallbackAlleSpråk(locale =>
                    statsborgerskap.map(objekt => landkodeTilSpråk(objekt.landkode, locale))
                )
            ),
            adresse: søknadsfelt('pdf.søker.adresse.label', sammeVerdiAlleSpråk(adresse)),
            adressebeskyttelse: søker.adressebeskyttelse,
            utenlandsperioder: utenlandsperioder.map((periode, index) =>
                utenlandsperiodeTilISøknadsfelt(periode, index + 1, PersonType.søker)
            ),
            idNummer: idNummer.map(idnummerObj =>
                idNummerTilISøknadsfelt(
                    idnummerObj,
                    eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer],
                    eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummerUkjent],
                    valgtSpråk
                )
            ),
            spørsmål: {
                ...spørmålISøknadsFormat(typetSøkerSpørsmål),
            },
            arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
                tilIArbeidsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    gjelderUtlandet: true,
                    personType: PersonType.søker,
                })
            ),
            arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
                tilIArbeidsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    gjelderUtlandet: false,
                    personType: PersonType.søker,
                })
            ),
            pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
                tilIPensjonsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    gjelderUtlandet: true,
                    personType: PersonType.søker,
                })
            ),
            pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
                tilIPensjonsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    gjelderUtlandet: false,
                    personType: PersonType.søker,
                })
            ),
            andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
                tilIAndreUtbetalingsperioderIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    personType: PersonType.søker,
                })
            ),
        },
        barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn, søker, valgtSpråk)),
        spørsmål: {
            erNoenAvBarnaFosterbarn: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn),
                sammeVerdiAlleSpråk(søknad.erNoenAvBarnaFosterbarn.svar)
            ),
            søktAsylForBarn: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.søktAsylForBarn),
                sammeVerdiAlleSpråk(søknad.søktAsylForBarn.svar)
            ),
            oppholderBarnSegIInstitusjon: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon),
                sammeVerdiAlleSpråk(søknad.oppholderBarnSegIInstitusjon.svar)
            ),
            barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfelt(
                språktekstIdFraSpørsmålId(
                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                ),
                sammeVerdiAlleSpråk(søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar)
            ),
            erBarnAdoptertFraUtland: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland),
                sammeVerdiAlleSpråk(søknad.erBarnAdoptertFraUtland.svar)
            ),
            mottarKontantstøtteForBarnFraAnnetEøsland: søknadsfelt(
                språktekstIdFraSpørsmålId(
                    OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland
                ),
                sammeVerdiAlleSpråk(søknad.mottarKontantstøtteForBarnFraAnnetEøsland.svar)
            ),
            harEllerTildeltBarnehageplass: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.harEllerTildeltBarnehageplass),
                sammeVerdiAlleSpråk(søknad.harEllerTildeltBarnehageplass.svar)
            ),
            erAvdødPartnerForelder: søknadsfelt(
                språktekstIdFraSpørsmålId(søknad.erAvdødPartnerForelder.id),
                sammeVerdiAlleSpråk(søknad.erAvdødPartnerForelder.svar)
            ),
            lestOgForståttBekreftelse: søknadsfelt(
                'forside.bekreftelsesboks.brødtekst',
                søknad.lestOgForståttBekreftelse
                    ? hentTekster('forside.bekreftelsesboks.erklæring.spm')
                    : sammeVerdiAlleSpråk(ESvar.NEI)
            ),
        },
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok => dokumentasjonISøknadFormat(dok)),
        teksterUtenomSpørsmål: {
            ...Object.values(ESivilstand).reduce(
                (map, sivilstand) => ({
                    ...map,
                    [ESanitySivilstandApiKey[ESivilstand[sivilstand]]]:
                        frittståendeOrdTekster[sivilstandTilSanitySivilstandApiKey(sivilstand)],
                }),
                {}
            ),
            ...[
                'hvilkebarn.barn.bosted.adressesperre',
                'ombarnet.fosterbarn',
                'ombarnet.institusjon',
                'ombarnet.opplystatbarnutlandopphold.info',
                'ombarnet.barnetrygd-eøs',
                'omdeg.annensamboer.spm',
                'omdeg.personopplysninger.adressesperre.alert',
                'omdeg.personopplysninger.ikke-registrert.alert',
                'pdf.andreforelder.seksjonstittel',
                'pdf.hvilkebarn.seksjonstittel',
                'pdf.hvilkebarn.registrert-på-adresse',
                'pdf.hvilkebarn.ikke-registrert-på-adresse',
                'pdf.ombarnet.seksjonstittel',
                'pdf.omdeg.seksjonstittel',
                'pdf.bosted.seksjonstittel',
                'pdf.ombarna.seksjonstittel',
                'pdf.søker-for-tidsrom.seksjonstittel',
                'pdf.søker.seksjonstittel',
                'pdf.vedlegg.seksjonstittel',
                'pdf.vedlegg.lastet-opp-antall',
                'pdf.vedlegg.nummerering',
                'dokumentasjon.har-sendt-inn.spm',
                'dinlivssituasjon.sidetittel',
                'eøs-om-deg.sidetittel',
                'eøs-om-barn.sidetittel',
                ...Object.values(ESvar).map(jaNeiSvarTilSpråkId),
            ].reduce(
                (map, tekstId) => ({ ...map, [tekstId]: hentUformaterteTekster(tekstId) }),
                {}
            ),
        },
        originalSpråk: valgtSpråk,
    };
};
