import { tilDatoUkjentLabelSpråkId } from '../../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    fraDatoLabelSpråkId,
    hentLandSpørsmålForÅrsak,
    tilDatoLabelSpråkId,
    utenlandsoppholdÅrsakTilTekst,
} from '../../components/Felleskomponenter/UtenlandsoppholdModal/utenlandsoppholdSpråkUtils';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, IUtenlandsperiodeIKontraktFormat } from '../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../typer/perioder';
import { PersonType } from '../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../typer/sanity/modaler/utenlandsopphold';
import { hentTekster, landkodeTilSpråk, sanitizedLocaleRecord } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

export const utenlandsperiodeTilISøknadsfelt = (
    utenlandperiode: IUtenlandsperiode,
    periodeNummer: number,
    personType: PersonType,
    tekster: IUtenlandsoppholdTekstinnhold,
    barn?: IBarnMedISøknad
): ISøknadsfelt<IUtenlandsperiodeIKontraktFormat> => {
    const { periodeBeskrivelse } = tekster;
    return {
        label: hentTekster('felles.leggtilutenlands.opphold', { x: periodeNummer }),
        verdi: sammeVerdiAlleSpråk({
            utenlandsoppholdÅrsak: {
                label: sanitizedLocaleRecord(periodeBeskrivelse.sporsmal),
                verdi: sanitizedLocaleRecord(
                    utenlandsoppholdÅrsakTilTekst(
                        utenlandperiode.utenlandsoppholdÅrsak.svar,
                        tekster
                    )
                ),
            },
            oppholdsland: {
                label: sanitizedLocaleRecord(
                    hentLandSpørsmålForÅrsak(utenlandperiode.utenlandsoppholdÅrsak.svar, tekster),
                    barn?.navn
                ),
                verdi: verdiCallbackAlleSpråk(locale =>
                    landkodeTilSpråk(utenlandperiode.oppholdsland.svar, locale)
                ),
            },
            oppholdslandFraDato: {
                label: hentTekster(
                    fraDatoLabelSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, personType),
                    { ...(barn && { barn: barn.navn }) }
                ),
                verdi: sammeVerdiAlleSpråk(utenlandperiode.oppholdslandFraDato?.svar),
            },
            oppholdslandTilDato: {
                label: hentTekster(
                    tilDatoLabelSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, personType),
                    { ...(barn && { barn: barn.navn }) }
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
