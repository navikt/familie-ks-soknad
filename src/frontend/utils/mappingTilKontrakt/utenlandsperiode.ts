import { tilDatoUkjentLabelSpråkId } from '../../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    utenlandsoppholdÅrsakTilTekst,
    årsakLabelSpråkId,
} from '../../components/Felleskomponenter/UtenlandsoppholdModal/utenlandsoppholdSpråkUtils';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, IUtenlandsperiodeIKontraktFormat } from '../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../typer/perioder';
import { PersonType } from '../../typer/personType';
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
    personType: PersonType,
    tekster: IUtenlandsoppholdTekstinnhold,
    barn?: IBarnMedISøknad
): ISøknadsfelt<IUtenlandsperiodeIKontraktFormat> => {
    return {
        label: hentTekster('felles.leggtilutenlands.opphold', { x: periodeNummer }),
        verdi: sammeVerdiAlleSpråk({
            utenlandsoppholdÅrsak: {
                label: hentTekster(årsakLabelSpråkId(personType), {
                    ...(barn && { barn: barn.navn }),
                }),
                verdi: utenlandsoppholdÅrsakTilTekst(
                    utenlandperiode.utenlandsoppholdÅrsak.svar,
                    tekster
                ),
            },
            oppholdsland: {
                label: hentTekster(
                    landLabelSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, personType),
                    { ...(barn && { barn: barn.navn }) }
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
