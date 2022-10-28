import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IUtbetalingsperiodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IUtbetalingsperiode } from '../../typer/perioder';
import { IAndreUtbetalingerTekstinnhold } from '../../typer/sanity/modaler/andreUtbetalinger';
import { landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

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
                    periodenErAvsluttet
                        ? tekster.utbetalingLandFortid.sporsmal
                        : tekster.utbetalingLandNaatid.sporsmal,
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
                verdi: sammeVerdiAlleSpråk(utbetalingFraDato.svar),
            },
            utbetalingTilDato: {
                label: tilRestLocaleRecord(
                    periodenErAvsluttet
                        ? tekster.sluttdatoFortid.sporsmal
                        : tekster.sluttdatoFremtid.sporsmal
                ),
                verdi: sammeVerdiAlleSpråkEllerUkjent(
                    tilRestLocaleRecord,
                    utbetalingTilDato.svar,
                    tekster.sluttdatoFremtid.checkboxLabel
                ),
            },
        }),
    };
};
