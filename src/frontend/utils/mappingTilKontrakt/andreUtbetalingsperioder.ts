import { ESvar } from '@navikt/familie-form-elements';

import type { ISODateString } from '../../../common/typer/ISODateString';
import type { ISøknadsfelt, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import type { IUtbetalingsperiodeIKontraktFormat } from '../../../common/typer/kontrakt/søknadKontrakt';
import type { IBarnMedISøknad } from '../../typer/barn';
import { AlternativtSvarForInput } from '../../typer/common';
import type { IUtbetalingsperiode } from '../../typer/perioder';
import type { IAndreUtbetalingerTekstinnhold } from '../../typer/sanity/modaler/andreUtbetalinger';
import type { ISøknadSpørsmål } from '../../typer/spørsmål';
import { formaterDatostringKunMåned } from '../dato';
import { landkodeTilSpråk } from '../språk';
import { uppercaseFørsteBokstav } from '../visning';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface UtbetalingsperiodeIKontraktFormatParams {
    periode: IUtbetalingsperiode;
    periodeNummer: number;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IAndreUtbetalingerTekstinnhold;
    barn?: IBarnMedISøknad;
}

export const tilIAndreUtbetalingsperioderIKontraktFormat = ({
    periode,
    periodeNummer,
    tilRestLocaleRecord,
    tekster,
    barn,
}: UtbetalingsperiodeIKontraktFormatParams): ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat> => {
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } = periode;

    const periodenErAvsluttet = fårUtbetalingNå?.svar !== ESvar.JA;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            fårUtbetalingNå: fårUtbetalingNå.svar
                ? {
                      label: tilRestLocaleRecord(tekster.faarUtbetalingerNaa.sporsmal, {
                          barnetsNavn: barn?.navn,
                      }),
                      verdi: sammeVerdiAlleSpråk(fårUtbetalingNå.svar),
                  }
                : null,
            utbetalingLand: {
                label: tilRestLocaleRecord(
                    periodenErAvsluttet ? tekster.utbetalingLandFortid.sporsmal : tekster.utbetalingLandNaatid.sporsmal,
                    {
                        barnetsNavn: barn?.navn,
                    }
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => utbetalingLand && landkodeTilSpråk(utbetalingLand.svar, locale)
                ),
            },
            utbetalingFraDato: {
                label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                verdi: datoTilVerdiForKontrakt(utbetalingFraDato),
            },
            utbetalingTilDato: {
                label: tilRestLocaleRecord(
                    periodenErAvsluttet ? tekster.sluttdatoFortid.sporsmal : tekster.sluttdatoFremtid.sporsmal
                ),
                verdi:
                    utbetalingTilDato.svar === AlternativtSvarForInput.UKJENT && tekster.sluttdatoFremtid.checkboxLabel
                        ? tilRestLocaleRecord(tekster.sluttdatoFremtid.checkboxLabel)
                        : datoTilVerdiForKontrakt(utbetalingTilDato),
            },
        }),
    };

    function datoTilVerdiForKontrakt(skjemaSpørsmål: ISøknadSpørsmål<ISODateString | ''>) {
        return verdiCallbackAlleSpråk(locale =>
            uppercaseFørsteBokstav(formaterDatostringKunMåned(skjemaSpørsmål.svar, locale))
        );
    }
};
