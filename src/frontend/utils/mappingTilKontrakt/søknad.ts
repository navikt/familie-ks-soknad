import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { LocaleRecordBlock, LocaleRecordString, LocaleType } from '../../typer/common';
import { ESivilstand, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/søknadKontrakt';
import { ISøker } from '../../typer/person';
import { ESanitySivilstandApiKey } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import { sivilstandTilSanitySivilstandApiKey } from '../språk';
import { jaNeiSvarTilSpråkId } from '../spørsmål';

import { barnISøknadsFormat } from './barn';
import { dokumentasjonISøknadFormat } from './dokumentasjon';
import { nullableSøknadsfeltForESvarHof, søknadsfeltForESvarHof } from './hjelpefunksjoner';
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

export const dataISøknadKontraktFormat = (
    valgtSpråk: LocaleType,
    søknad: ISøknad,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): ISøknadKontrakt => {
    const { søker } = søknad;
    // Raskeste måte å få tak i alle spørsmål minus de andre feltene på søker
    const { barnInkludertISøknaden } = søknad;
    const fellesTekster = tekster.FELLES;

    const nullableSøknadsfeltForESvar = nullableSøknadsfeltForESvarHof(tilRestLocaleRecord);
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);

    return {
        kontraktVersjon: 4,
        antallEøsSteg: antallEøsSteg(søker, barnInkludertISøknaden),
        søker: søkerIKontraktFormat(søknad, tekster, tilRestLocaleRecord),
        barn: barnInkludertISøknaden.map(barn =>
            barnISøknadsFormat(barn, søknad, tekster, tilRestLocaleRecord)
        ),
        lestOgForståttBekreftelse: søknad.lestOgForståttBekreftelse,
        erNoenAvBarnaFosterbarn: søknadsfeltForESvar(
            tekster.OM_BARNA.fosterbarn.sporsmal,
            søknad.erNoenAvBarnaFosterbarn.svar
        ),
        søktAsylForBarn: søknadsfeltForESvar(
            tekster.OM_BARNA.asyl.sporsmal,
            søknad.søktAsylForBarn.svar
        ),
        oppholderBarnSegIInstitusjon: søknadsfeltForESvar(
            tekster.OM_BARNA.institusjonKontantstoette.sporsmal,
            søknad.oppholderBarnSegIInstitusjon.svar
        ),
        barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfeltForESvar(
            tekster.OM_BARNA.sammenhengendeOppholdINorge.sporsmal,
            søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar
        ),
        erBarnAdoptert: søknadsfeltForESvar(
            tekster.OM_BARNA.adoptertKontantstoette.sporsmal,
            søknad.erBarnAdoptert.svar
        ),
        mottarKontantstøtteForBarnFraAnnetEøsland: søknadsfeltForESvar(
            tekster.OM_BARNA.soektYtelseEuEoes.sporsmal,
            søknad.mottarKontantstøtteForBarnFraAnnetEøsland.svar
        ),
        harEllerTildeltBarnehageplass: søknadsfeltForESvar(
            tekster.OM_BARNA.barnehageplass.sporsmal,
            søknad.harEllerTildeltBarnehageplass.svar
        ),
        erAvdødPartnerForelder: nullableSøknadsfeltForESvar(
            søknad.erAvdødPartnerForelder.id ===
                OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                ? tekster.OM_BARNA.folkeregistrertGjenlevende.sporsmal
                : tekster.OM_BARNA.folkeregistrertEnkeEnkemann.sporsmal,
            søknad.erAvdødPartnerForelder.svar
        ),
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok => dokumentasjonISøknadFormat(dok, tekster, tilRestLocaleRecord, søknad)),
        teksterTilPdf: {
            ...Object.values(ESivilstand).reduce(
                (map, sivilstand) => ({
                    ...map,
                    [ESanitySivilstandApiKey[ESivilstand[sivilstand]]]: tilRestLocaleRecord(
                        fellesTekster.frittståendeOrd[
                            sivilstandTilSanitySivilstandApiKey(sivilstand)
                        ]
                    ),
                }),
                {}
            ),
            ...[
                tekster.FORSIDE.bekreftelsesboksBroedtekst,
                tekster.FORSIDE.bekreftelsesboksErklaering,
                tekster.OM_DEG.soekerAdressesperre,
                tekster.OM_DEG.ikkeRegistrertAdresse,
                tekster.OM_DEG.skjermetAdresse,
                tekster.OM_DEG.omDegTittel,
                tekster.DIN_LIVSSITUASJON.dinLivssituasjonTittel,
                tekster.VELG_BARN.registrertMedAdressesperre,
                tekster.VELG_BARN.velgBarnTittel,
                tekster.VELG_BARN.registrertPaaAdressenDin,
                tekster.VELG_BARN.ikkeRegistrertPaaAdressenDin,
                tekster.OM_BARNA.omBarnaTittel,
                tekster.EØS_FOR_SØKER.eoesForSoekerTittel,
                tekster.FELLES.frittståendeOrd.vedlegg,
                tekster.FELLES.frittståendeOrd.av,
                tekster.FELLES.frittståendeOrd.soeker,
                tekster.DOKUMENTASJON.sendtInnTidligere,
                ...Object.values(ESvar).map(svar =>
                    jaNeiSvarTilSpråkId(svar, tekster.FELLES.frittståendeOrd)
                ),
            ].reduce(
                (map, sanityDok: LocaleRecordBlock | LocaleRecordString) => ({
                    ...map,
                    [sanityDok.api_navn]: tilRestLocaleRecord(sanityDok, {}),
                }),
                {}
            ),
        },
        originalSpråk: valgtSpråk,
    };
};
