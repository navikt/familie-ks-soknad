import type { ISøknadsfelt, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import type { IIdNummerIKontraktFormat } from '../../../common/typer/kontrakt/søknadKontrakt';
import type { IIdNummer } from '../../typer/person';
import type { ISanitySpørsmålDokument } from '../../typer/sanity/sanity';
import { landkodeTilSpråk } from '../språk';

import { sammeVerdiAlleSpråk, sammeVerdiAlleSpråkEllerUkjent, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

export const idNummerTilISøknadsfelt = (
    tilRestLocaleRecord: TilRestLocaleRecord,
    idnummerObj: IIdNummer,
    spørsmålsdokument: ISanitySpørsmålDokument,
    barnetsNavn?: string
): ISøknadsfelt<IIdNummerIKontraktFormat> => ({
    label: tilRestLocaleRecord(spørsmålsdokument.sporsmal, {
        land: idnummerObj.land,
        barnetsNavn,
    }),
    verdi: sammeVerdiAlleSpråk({
        idNummer: {
            label: tilRestLocaleRecord(spørsmålsdokument.sporsmal, {
                land: idnummerObj.land,
                barnetsNavn,
            }),
            verdi: sammeVerdiAlleSpråkEllerUkjent(
                tilRestLocaleRecord,
                idnummerObj.idnummer,
                spørsmålsdokument.checkboxLabel,
                {
                    land: idnummerObj.land,
                }
            ),
        },
        land: {
            label: tilRestLocaleRecord(spørsmålsdokument.sporsmal, {
                land: idnummerObj.land,
                barnetsNavn,
            }),
            verdi: verdiCallbackAlleSpråk(locale => landkodeTilSpråk(idnummerObj.land, locale)),
        },
    }),
});
