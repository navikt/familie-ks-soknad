import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from '../../components/Felleskomponenter/UtenlandsoppholdModal/utenlandsoppholdSpråkUtils';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, IUtenlandsperiodeIKontraktFormat, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../typer/perioder';
import { IUtenlandsoppholdTekstinnhold } from '../../typer/sanity/modaler/utenlandsopphold';
import { ISanitySpørsmålDokument } from '../../typer/sanity/sanity';
import { EUtenlandsoppholdÅrsak } from '../../typer/utenlandsopphold';
import { landkodeTilSpråk } from '../språk';

import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface UtenlandsperiodeIKontraktFormatParams {
    utenlandperiode: IUtenlandsperiode;
    periodeNummer: number;
    tekster: IUtenlandsoppholdTekstinnhold;
    tilRestLocaleRecord: TilRestLocaleRecord;
    barn?: IBarnMedISøknad;
}
export const utenlandsperiodeTilISøknadsfelt = ({
    utenlandperiode,
    periodeNummer,
    tekster,
    tilRestLocaleRecord,
    barn,
}: UtenlandsperiodeIKontraktFormatParams): ISøknadsfelt<IUtenlandsperiodeIKontraktFormat> => {
    const { periodeBeskrivelse, adresseNaatid, adresseFortid } = tekster;
    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);

    const adresseTekst: ISanitySpørsmålDokument | undefined =
        utenlandperiode.utenlandsoppholdÅrsak.svar === EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE ||
        utenlandperiode.utenlandsoppholdÅrsak.svar === EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE
            ? adresseFortid
            : adresseNaatid;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            utenlandsoppholdÅrsak: {
                label: tilRestLocaleRecord(periodeBeskrivelse.sporsmal),
                verdi: tilRestLocaleRecord(
                    hentUtenlandsoppholdÅrsak(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster)
                ),
            },
            oppholdsland: {
                label: tilRestLocaleRecord(hentLandSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster), {
                    barnetsNavn: barn?.navn,
                }),
                verdi: verdiCallbackAlleSpråk(locale => landkodeTilSpråk(utenlandperiode.oppholdsland.svar, locale)),
            },
            oppholdslandFraDato: utenlandperiode.oppholdslandFraDato?.svar
                ? {
                      label: tilRestLocaleRecord(
                          hentFraDatoSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster)
                      ),
                      verdi: sammeVerdiAlleSpråk(utenlandperiode.oppholdslandFraDato?.svar),
                  }
                : null,
            oppholdslandTilDato: utenlandperiode.oppholdslandTilDato?.svar
                ? {
                      label: tilRestLocaleRecord(
                          hentTilDatoSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster)
                      ),
                      verdi: sammeVerdiAlleSpråkEllerUkjent(
                          tilRestLocaleRecord,
                          utenlandperiode.oppholdslandTilDato?.svar,
                          tekster.sluttdatoFremtid.checkboxLabel
                      ),
                  }
                : null,
            adresse: utenlandperiode.adresse?.svar
                ? søknadsfelt(
                      adresseTekst?.sporsmal,
                      sammeVerdiAlleSpråkEllerUkjent(
                          tilRestLocaleRecord,
                          utenlandperiode.adresse.svar,
                          adresseTekst?.checkboxLabel
                      )
                  )
                : null,
        }),
    };
};
