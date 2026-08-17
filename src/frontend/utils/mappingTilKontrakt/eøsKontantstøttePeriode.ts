import { ESvar } from '@navikt/familie-form-elements';

import type { ISODateString } from '../../../common/typer/ISODateString';
import type { ISøknadsfelt, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import type { IEøsKontantstøttePeriodeIKontraktFormat } from '../../../common/typer/kontrakt/søknadKontrakt';
import type { IBarnMedISøknad } from '../../typer/barn';
import type { IEøsKontantstøttePeriode } from '../../typer/perioder';
import type { IEøsYtelseTekstinnhold } from '../../typer/sanity/modaler/eøsYtelse';
import type { ISøknadSpørsmål } from '../../typer/spørsmål';
import { formaterDatostringKunMåned } from '../dato';
import { landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonperiodeIKontraktFormatParams {
    periode: IEøsKontantstøttePeriode;
    periodeNummer: number;
    barn: IBarnMedISøknad;
    tilRestLocaleRecord: TilRestLocaleRecord;
    eøsYtelseTekster: IEøsYtelseTekstinnhold;
}

export const tilIEøsKontantstøttePeriodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tilRestLocaleRecord,
    eøsYtelseTekster,
    barn,
}: PensjonperiodeIKontraktFormatParams): ISøknadsfelt<IEøsKontantstøttePeriodeIKontraktFormat> => {
    const {
        mottarEøsKontantstøtteNå,
        kontantstøtteLand,
        fraDatoKontantstøttePeriode,
        tilDatoKontantstøttePeriode,
        månedligBeløp,
    } = periode;
    const periodenErAvsluttet = mottarEøsKontantstøtteNå.svar !== ESvar.JA;

    const flettefelter = { barnetsNavn: barn.navn };

    return {
        label: tilRestLocaleRecord(eøsYtelseTekster.oppsummeringstittelKontantstoette, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsKontantstøtteNå: mottarEøsKontantstøtteNå.svar
                ? {
                      label: tilRestLocaleRecord(eøsYtelseTekster.faarYtelserNaa.sporsmal, flettefelter),
                      verdi: sammeVerdiAlleSpråk(mottarEøsKontantstøtteNå.svar),
                  }
                : null,
            kontantstøtteLand: {
                label: tilRestLocaleRecord(
                    periodenErAvsluttet
                        ? eøsYtelseTekster.ytelseLandFortid.sporsmal
                        : eøsYtelseTekster.ytelseLandNaatid.sporsmal,
                    flettefelter
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => kontantstøtteLand && landkodeTilSpråk(kontantstøtteLand.svar, locale)
                ),
            },
            fraDatoKontantstøttePeriode: {
                label: tilRestLocaleRecord(eøsYtelseTekster.startdato.sporsmal),
                verdi: datoTilVerdiForKontrakt(fraDatoKontantstøttePeriode),
            },
            tilDatoKontantstøttePeriode: tilDatoKontantstøttePeriode.svar
                ? {
                      label: tilRestLocaleRecord(eøsYtelseTekster.sluttdato.sporsmal),
                      verdi: datoTilVerdiForKontrakt(tilDatoKontantstøttePeriode),
                  }
                : null,
            månedligBeløp: {
                label: tilRestLocaleRecord(eøsYtelseTekster.beloepPerMaaned.sporsmal, flettefelter),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };

    function datoTilVerdiForKontrakt(skjemaSpørsmål: ISøknadSpørsmål<ISODateString | ''>) {
        return verdiCallbackAlleSpråk(locale =>
            uppercaseFørsteBokstav(formaterDatostringKunMåned(skjemaSpørsmål.svar, locale))
        );
    }
};
