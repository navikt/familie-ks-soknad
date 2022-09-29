import { tilDatoUkjentLabelSpråkId } from '../../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    utenlandsoppholdÅrsakTilTekst,
} from '../../components/Felleskomponenter/UtenlandsoppholdModal/utenlandsoppholdSpråkUtils';
import {
    ISøknadsfelt,
    IUtenlandsperiodeIKontraktFormat,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../typer/perioder';
import { IUtenlandsoppholdTekstinnhold } from '../../typer/sanity/modaler/utenlandsopphold';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

export const utenlandsperiodeTilISøknadsfelt = (
    utenlandperiode: IUtenlandsperiode,
    periodeNummer: number,
    tekster: IUtenlandsoppholdTekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): ISøknadsfelt<IUtenlandsperiodeIKontraktFormat> => {
    const { periodeBeskrivelse } = tekster;
    return {
        label: hentTekster('felles.leggtilutenlands.opphold', { x: periodeNummer }),
        verdi: sammeVerdiAlleSpråk({
            utenlandsoppholdÅrsak: {
                label: tilRestLocaleRecord(periodeBeskrivelse.sporsmal),
                verdi: tilRestLocaleRecord(
                    utenlandsoppholdÅrsakTilTekst(
                        utenlandperiode.utenlandsoppholdÅrsak.svar,
                        tekster
                    )
                ),
            },
            oppholdsland: {
                label: tilRestLocaleRecord(
                    hentLandSpørsmål(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster)
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
                    ? sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                          utenlandperiode.oppholdslandTilDato?.svar,
                          tilDatoUkjentLabelSpråkId
                      )
                    : sammeVerdiAlleSpråk(undefined),
            },
        }),
    };
};
