import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ESivilstand, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/v1';
import { ISøker } from '../../typer/person';
import { PersonType } from '../../typer/personType';
import { ESanitySivilstandApiKey } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
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
    søknadsfeltGammel,
    søknadsfeltHof,
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
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
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
    const fellesTekster = tekster.FELLES;
    const omDegTekster = tekster.OM_DEG;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);

    return {
        kontraktVersjon: 1,
        antallEøsSteg: antallEøsSteg(søker, barnInkludertISøknaden),
        søker: {
            harEøsSteg:
                triggetEøs || !!barnInkludertISøknaden.filter(barn => barn.triggetEøs).length,
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
            adressebeskyttelse: søker.adressebeskyttelse,
            utenlandsperioder: utenlandsperioder.map((periode, index) =>
                utenlandsperiodeTilISøknadsfelt(
                    periode,
                    index + 1,
                    fellesTekster.modaler.utenlandsopphold[PersonType.søker],
                    tilRestLocaleRecord
                )
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
        barn: barnInkludertISøknaden.map(barn =>
            barnISøknadsFormat(barn, søker, valgtSpråk, tekster, tilRestLocaleRecord)
        ),
        spørsmål: {
            erNoenAvBarnaFosterbarn: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn),
                sammeVerdiAlleSpråk(søknad.erNoenAvBarnaFosterbarn.svar)
            ),
            søktAsylForBarn: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.søktAsylForBarn),
                sammeVerdiAlleSpråk(søknad.søktAsylForBarn.svar)
            ),
            oppholderBarnSegIInstitusjon: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon),
                sammeVerdiAlleSpråk(søknad.oppholderBarnSegIInstitusjon.svar)
            ),
            barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(
                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                ),
                sammeVerdiAlleSpråk(søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar)
            ),
            erBarnAdoptertFraUtland: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland),
                sammeVerdiAlleSpråk(søknad.erBarnAdoptertFraUtland.svar)
            ),
            mottarKontantstøtteForBarnFraAnnetEøsland: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(
                    OmBarnaDineSpørsmålId.mottarKontantstøtteForBarnFraAnnetEøsland
                ),
                sammeVerdiAlleSpråk(søknad.mottarKontantstøtteForBarnFraAnnetEøsland.svar)
            ),
            harEllerTildeltBarnehageplass: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.harEllerTildeltBarnehageplass),
                sammeVerdiAlleSpråk(søknad.harEllerTildeltBarnehageplass.svar)
            ),
            erAvdødPartnerForelder: søknadsfeltGammel(
                språktekstIdFraSpørsmålId(søknad.erAvdødPartnerForelder.id),
                sammeVerdiAlleSpråk(søknad.erAvdødPartnerForelder.svar)
            ),
            lestOgForståttBekreftelse: søknadsfeltGammel(
                'forside.bekreftelsesboks.brødtekst',
                søknad.lestOgForståttBekreftelse
                    ? hentTekster('forside.bekreftelsesboks.erklæring.spm')
                    : sammeVerdiAlleSpråk(ESvar.NEI)
            ),
        },
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok => dokumentasjonISøknadFormat(dok, tekster, tilRestLocaleRecord)),
        teksterUtenomSpørsmål: {
            ...Object.values(ESivilstand).reduce(
                (map, sivilstand) => ({
                    ...map,
                    [ESanitySivilstandApiKey[ESivilstand[sivilstand]]]:
                        fellesTekster.frittståendeOrd[
                            sivilstandTilSanitySivilstandApiKey(sivilstand)
                        ],
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
