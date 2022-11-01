import {
    hentFraDatoSpørsmål,
    hentTilDatoSpørsmål,
} from '../../components/Felleskomponenter/Barnehagemodal/barnehageplassSpråkUtils';
import { ISøknadsfelt, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IBarnehageplassPeriodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IBarnehageplassPeriode } from '../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../typer/sanity/modaler/barnehageplass';
import { landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface BarnehageplassperiodeIKontraktFormatParams {
    periode: IBarnehageplassPeriode;
    periodeNummer: number;
    tilRestLocaleRecord: TilRestLocaleRecord;
    tekster: IBarnehageplassTekstinnhold;
}

export const tilIBarnehageplassPeriodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tilRestLocaleRecord,
    tekster,
}: BarnehageplassperiodeIKontraktFormatParams): ISøknadsfelt<IBarnehageplassPeriodeIKontraktFormat> => {
    const {
        barnehageplassPeriodeBeskrivelse,
        barnehageplassUtlandet,
        barnehageplassLand,
        offentligStøtte,
        antallTimer,
        startetIBarnehagen,
        slutterIBarnehagen,
    } = periode;

    return {
        label: tilRestLocaleRecord(tekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            barnehageplassPeriodeBeskrivelse: {
                label: tilRestLocaleRecord(tekster.periodebeskrivelse.sporsmal),
                verdi: sammeVerdiAlleSpråk(barnehageplassPeriodeBeskrivelse.svar),
            },
            barnehageplassUtlandet: {
                label: tilRestLocaleRecord(tekster.utland.sporsmal),
                verdi: sammeVerdiAlleSpråk(barnehageplassUtlandet.svar),
            },
            barnehageplassLand: barnehageplassLand.svar
                ? {
                      label: tilRestLocaleRecord(tekster.hvilketLand.sporsmal),
                      verdi: verdiCallbackAlleSpråk(
                          locale =>
                              barnehageplassLand &&
                              landkodeTilSpråk(barnehageplassLand.svar, locale)
                      ),
                  }
                : null,
            offentligStøtte: offentligStøtte.svar
                ? {
                      label: tilRestLocaleRecord(tekster.offentligStoette.sporsmal),
                      verdi: sammeVerdiAlleSpråk(offentligStøtte.svar),
                  }
                : null,
            antallTimer: {
                label: tilRestLocaleRecord(tekster.antallTimer.sporsmal),
                verdi: sammeVerdiAlleSpråk(antallTimer.svar),
            },
            startetIBarnehagen: {
                label: tilRestLocaleRecord(
                    hentFraDatoSpørsmål(barnehageplassPeriodeBeskrivelse.svar, tekster)
                ),
                verdi: sammeVerdiAlleSpråk(startetIBarnehagen.svar),
            },
            slutterIBarnehagen: {
                label: tilRestLocaleRecord(
                    hentTilDatoSpørsmål(barnehageplassPeriodeBeskrivelse.svar, tekster)
                ),
                verdi: sammeVerdiAlleSpråkEllerUkjent(
                    tilRestLocaleRecord,
                    slutterIBarnehagen.svar,
                    tekster.sluttdatoFremtid.checkboxLabel
                ),
            },
        }),
    };
};
