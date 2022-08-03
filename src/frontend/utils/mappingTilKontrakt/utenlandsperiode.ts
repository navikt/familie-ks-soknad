import { tilDatoUkjentLabelSpråkId } from '../../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    årsakLabelSpråkId,
    årsakSpråkId,
} from '../../components/Felleskomponenter/UtenlandsoppholdModal/utenlandsoppholdSpråkUtils';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, IUtenlandsperiodeIKontraktFormat } from '../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../typer/perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

export const utenlandsperiodeTilISøknadsfelt = (
    utenlandperiode: IUtenlandsperiode,
    periodeNummer: number,
    barn?: IBarnMedISøknad
): ISøknadsfelt<IUtenlandsperiodeIKontraktFormat> => {
    return {
        label: hentTekster('felles.leggtilutenlands.opphold', { x: periodeNummer }),
        verdi: sammeVerdiAlleSpråk({
            utenlandsoppholdÅrsak: {
                label: hentTekster(årsakLabelSpråkId(barn), {
                    ...(barn && { barn: barn.navn }),
                }),
                verdi: hentTekster(årsakSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, barn)),
            },
            oppholdsland: {
                label: hentTekster(
                    landLabelSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, barn),
                    { ...(barn && { barn: barn.navn }) }
                ),
                verdi: verdiCallbackAlleSpråk(locale =>
                    landkodeTilSpråk(utenlandperiode.oppholdsland.svar, locale)
                ),
            },
            oppholdslandFraDato: {
                label: hentTekster(
                    fraDatoLabelSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, barn),
                    { ...(barn && { barn: barn.navn }) }
                ),
                verdi: sammeVerdiAlleSpråk(utenlandperiode.oppholdslandFraDato?.svar),
            },
            oppholdslandTilDato: {
                label: hentTekster(
                    tilDatoLabelSpråkId(utenlandperiode.utenlandsoppholdÅrsak.svar, barn),
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
