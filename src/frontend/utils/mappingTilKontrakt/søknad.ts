import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { ESivilstand, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/v1';
import { ISøker } from '../../typer/person';
import { ESanitySivilstandApiKey } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import { sivilstandTilSanitySivilstandApiKey, hentUformaterteTekster } from '../språk';
import { jaNeiSvarTilSpråkId } from '../spørsmål';
import { barnISøknadsFormat } from './barn';
import { dokumentasjonISøknadFormat } from './dokumentasjon';
import { sammeVerdiAlleSpråk, søknadsfeltHof } from './hjelpefunksjoner';
import { søkerIKontraktFormat } from './søker';

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
    const { barnInkludertISøknaden } = søknad;
    const fellesTekster = tekster.FELLES;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);

    return {
        kontraktVersjon: 1,
        antallEøsSteg: antallEøsSteg(søker, barnInkludertISøknaden),
        søker: søkerIKontraktFormat(søknad, tekster, tilRestLocaleRecord),
        barn: barnInkludertISøknaden.map(barn =>
            barnISøknadsFormat(barn, søknad, tekster, tilRestLocaleRecord)
        ),
        spørsmål: {
            erNoenAvBarnaFosterbarn: søknadsfelt(
                tekster.OM_BARNA.fosterbarn.sporsmal,
                sammeVerdiAlleSpråk(søknad.erNoenAvBarnaFosterbarn.svar)
            ),
            søktAsylForBarn: søknadsfelt(
                tekster.OM_BARNA.asyl.sporsmal,
                sammeVerdiAlleSpråk(søknad.søktAsylForBarn.svar)
            ),
            oppholderBarnSegIInstitusjon: søknadsfelt(
                tekster.OM_BARNA.institusjonKontantstoette.sporsmal,
                sammeVerdiAlleSpråk(søknad.oppholderBarnSegIInstitusjon.svar)
            ),
            barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfelt(
                tekster.OM_BARNA.sammenhengendeOppholdINorge.sporsmal,
                sammeVerdiAlleSpråk(søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar)
            ),
            erBarnAdoptert: søknadsfelt(
                tekster.OM_BARNA.adoptertKontantstoette.sporsmal,
                sammeVerdiAlleSpråk(søknad.erBarnAdoptert.svar)
            ),
            mottarKontantstøtteForBarnFraAnnetEøsland: søknadsfelt(
                tekster.OM_BARNA.soektYtelseEuEoes.sporsmal,
                sammeVerdiAlleSpråk(søknad.mottarKontantstøtteForBarnFraAnnetEøsland.svar)
            ),
            harEllerTildeltBarnehageplass: søknadsfelt(
                tekster.OM_BARNA.barnehageplass.sporsmal,
                sammeVerdiAlleSpråk(søknad.harEllerTildeltBarnehageplass.svar)
            ),
            erAvdødPartnerForelder: søknadsfelt(
                søknad.erAvdødPartnerForelder.id ===
                    OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                    ? tekster.OM_BARNA.folkeregistrertGjenlevende.sporsmal
                    : tekster.OM_BARNA.folkeregistrertEnkeEnkemann.sporsmal,
                sammeVerdiAlleSpråk(søknad.erAvdødPartnerForelder.svar)
            ),
            lestOgForståttBekreftelse: søknadsfelt(
                tekster.FORSIDE.bekreftelsesboksBroedtekst,
                søknad.lestOgForståttBekreftelse
                    ? tilRestLocaleRecord(tekster.FORSIDE.bekreftelsesboksErklaering)
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
