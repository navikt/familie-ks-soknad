import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IEøsKontantstøttePeriodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IEøsKontantstøttePeriode } from '../../typer/perioder';
import { IEøsYtelseTekstinnhold } from '../../typer/sanity/modaler/eøsYtelse';
import { landkodeTilSpråk } from '../språk';
import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';

interface PensjonperiodeIKontraktFormatParams {
    periode: IEøsKontantstøttePeriode;
    periodeNummer: number;
    barn: IBarnMedISøknad;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IEøsYtelseTekstinnhold;
}

export const tilIEøsKontantstøttePeriodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tilRestLocaleRecord,
    tekster,
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
        label: tilRestLocaleRecord(tekster.oppsummeringstittelKontantstoette, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            mottarEøsKontantstøtteNå: mottarEøsKontantstøtteNå.svar
                ? {
                      label: tilRestLocaleRecord(tekster.faarYtelserNaa.sporsmal, flettefelter),
                      verdi: sammeVerdiAlleSpråk(mottarEøsKontantstøtteNå.svar),
                  }
                : null,
            kontantstøtteLand: {
                label: tilRestLocaleRecord(
                    periodenErAvsluttet
                        ? tekster.ytelseLandFortid.sporsmal
                        : tekster.ytelseLandNaatid.sporsmal,
                    flettefelter
                ),
                verdi: verdiCallbackAlleSpråk(
                    locale => kontantstøtteLand && landkodeTilSpråk(kontantstøtteLand.svar, locale)
                ),
            },
            fraDatoKontantstøttePeriode: {
                label: tilRestLocaleRecord(tekster.startdato.sporsmal),
                verdi: sammeVerdiAlleSpråk(fraDatoKontantstøttePeriode?.svar),
            },
            tilDatoKontantstøttePeriode: tilDatoKontantstøttePeriode.svar
                ? {
                      label: tilRestLocaleRecord(tekster.sluttdato.sporsmal),
                      verdi: sammeVerdiAlleSpråk(tilDatoKontantstøttePeriode?.svar ?? null),
                  }
                : null,
            månedligBeløp: {
                label: tilRestLocaleRecord(tekster.beloepPerMaaned.sporsmal, flettefelter),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };
};
