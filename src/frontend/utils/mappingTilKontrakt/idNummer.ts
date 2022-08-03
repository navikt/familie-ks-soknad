import { getName } from 'i18n-iso-countries';

import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IIdNummerIKontraktFormat } from '../../typer/kontrakt/v1';
import { IIdNummer } from '../../typer/person';
import { hentTekster } from '../språk';
import { sammeVerdiAlleSpråk, sammeVerdiAlleSpråkEllerUkjentSpråktekst } from './hjelpefunksjoner';

export const idNummerTilISøknadsfelt = (
    idnummerObj: IIdNummer,
    spørsmålSpråkId: string,
    ukjentSvarSpråkId: string,
    valgtSpråk: LocaleType,
    barnetsNavn?: string
): ISøknadsfelt<IIdNummerIKontraktFormat> => ({
    label: hentTekster(spørsmålSpråkId, {
        land: getName(idnummerObj.land, valgtSpråk),
        ...(barnetsNavn && { barn: barnetsNavn }),
    }),
    verdi: sammeVerdiAlleSpråk({
        idNummer: {
            label: hentTekster(spørsmålSpråkId, {
                land: getName(idnummerObj.land, valgtSpråk),
                ...(barnetsNavn && { barn: barnetsNavn }),
            }),
            verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                idnummerObj.idnummer,
                ukjentSvarSpråkId,
                {
                    land: getName(idnummerObj.land, valgtSpråk),
                }
            ),
        },
        land: {
            label: hentTekster(spørsmålSpråkId, {
                land: getName(idnummerObj.land, valgtSpråk),
                ...(barnetsNavn && { barn: barnetsNavn }),
            }),
            verdi: sammeVerdiAlleSpråk(idnummerObj.land),
        },
    }),
});
