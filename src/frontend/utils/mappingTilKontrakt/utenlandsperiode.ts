import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from '../../components/Felleskomponenter/UtenlandsoppholdModal/utenlandsoppholdSpråkUtils';
import { IBarnMedISøknad } from '../../typer/barn';
import {
    ISøknadsfelt,
    IUtenlandsperiodeIKontraktFormat,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../typer/perioder';
import { IUtenlandsoppholdTekstinnhold } from '../../typer/sanity/modaler/utenlandsopphold';
import { landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
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
    const { periodeBeskrivelse } = tekster;
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
                label: tilRestLocaleRecord(
                    hentLandSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster),
                    { barnetsNavn: barn?.navn }
                ),
                verdi: verdiCallbackAlleSpråk(locale =>
                    landkodeTilSpråk(utenlandperiode.oppholdsland.svar, locale)
                ),
            },
            oppholdslandFraDato: {
                label: tilRestLocaleRecord(
                    hentFraDatoSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster)
                ),
                verdi: sammeVerdiAlleSpråk(utenlandperiode.oppholdslandFraDato?.svar),
            },
            oppholdslandTilDato: {
                label: tilRestLocaleRecord(
                    hentTilDatoSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster)
                ),
                verdi: utenlandperiode.oppholdslandTilDato?.svar
                    ? sammeVerdiAlleSpråkEllerUkjent(
                          tilRestLocaleRecord,
                          utenlandperiode.oppholdslandTilDato?.svar,
                          tekster.sluttdatoFremtid.checkboxLabel
                      )
                    : sammeVerdiAlleSpråk(undefined),
            },
        }),
    };
};
