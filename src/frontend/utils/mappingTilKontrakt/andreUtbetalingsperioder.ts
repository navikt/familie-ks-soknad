import { ESvar } from '@navikt/familie-form-elements';

import { utbetalingsperiodeModalSpørsmålSpråkIder } from '../../components/Felleskomponenter/UtbetalingerModal/språkUtils';
import { UtbetalingerSpørsmålId } from '../../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IUtbetalingsperiodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IUtbetalingsperiode } from '../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../typer/personType';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface UtbetalingsperiodeIKontraktFormatParams {
    periode: IUtbetalingsperiode;
    periodeNummer: number;
}

export const tilIAndreUtbetalingsperioderIKontraktFormat = ({
    periode,
    periodeNummer,
    personType,
    erDød,
    barn,
}: UtbetalingsperiodeIKontraktFormatParams &
    PeriodePersonTypeMedBarnProps): ISøknadsfelt<IUtbetalingsperiodeIKontraktFormat> => {
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } = periode;
    const periodenErAvsluttet =
        fårUtbetalingNå?.svar === ESvar.NEI || (personType === PersonType.andreForelder && erDød);

    const hentUtbetalingsperiodeSpråkId = utbetalingsperiodeModalSpørsmålSpråkIder(
        personType,
        periodenErAvsluttet
    );

    const hentSpørsmålstekster = (utbetalingsSpørsmålId: UtbetalingerSpørsmålId) =>
        hentTekster(hentUtbetalingsperiodeSpråkId(utbetalingsSpørsmålId), {
            ...(barn && { barn: barn.navn }),
        });
    return {
        label: hentTekster('felles.flereytelser.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            fårUtbetalingNå: fårUtbetalingNå.svar
                ? {
                      label: hentSpørsmålstekster(UtbetalingerSpørsmålId.fårUtbetalingNå),
                      verdi: sammeVerdiAlleSpråk(fårUtbetalingNå.svar),
                  }
                : null,
            utbetalingLand: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingLand),
                verdi: verdiCallbackAlleSpråk(
                    locale => utbetalingLand && landkodeTilSpråk(utbetalingLand.svar, locale)
                ),
            },
            utbetalingFraDato: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingFraDato),
                verdi: sammeVerdiAlleSpråk(utbetalingFraDato.svar),
            },
            utbetalingTilDato: {
                label: hentSpørsmålstekster(UtbetalingerSpørsmålId.utbetalingTilDato),
                verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    utbetalingTilDato.svar,
                    hentUtbetalingsperiodeSpråkId(UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke)
                ),
            },
        }),
    };
};
