import { ESvar } from '@navikt/familie-form-elements';

import { sammeVerdiAlleSpråk, verdiCallbackAlleSpråk } from './hjelpefunksjoner';
import { IBarnMedISøknad } from '../../typer/barn';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IEøsKontantstøttePeriodeIKontraktFormat } from '../../typer/kontrakt/søknadKontrakt';
import { IEøsKontantstøttePeriode } from '../../typer/perioder';
import { IEøsYtelseTekstinnhold } from '../../typer/sanity/modaler/eøsYtelse';
import { landkodeTilSpråk } from '../språk';

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
                      label: tilRestLocaleRecord(
                          eøsYtelseTekster.faarYtelserNaa.sporsmal,
                          flettefelter
                      ),
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
                verdi: sammeVerdiAlleSpråk(fraDatoKontantstøttePeriode?.svar),
            },
            tilDatoKontantstøttePeriode: tilDatoKontantstøttePeriode.svar
                ? {
                      label: tilRestLocaleRecord(eøsYtelseTekster.sluttdato.sporsmal),
                      verdi: sammeVerdiAlleSpråk(tilDatoKontantstøttePeriode?.svar ?? null),
                  }
                : null,
            månedligBeløp: {
                label: tilRestLocaleRecord(eøsYtelseTekster.beloepPerMaaned.sporsmal, flettefelter),
                verdi: sammeVerdiAlleSpråk(månedligBeløp.svar),
            },
        }),
    };
};
