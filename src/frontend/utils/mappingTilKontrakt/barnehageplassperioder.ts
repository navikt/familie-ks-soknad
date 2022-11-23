import {
    hentBarnehageplassBeskrivelse,
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
    barnehageplassTekster: IBarnehageplassTekstinnhold;
}

export const tilIBarnehageplassPeriodeIKontraktFormat = ({
    periode,
    periodeNummer,
    tilRestLocaleRecord,
    barnehageplassTekster,
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
        label: tilRestLocaleRecord(barnehageplassTekster.oppsummeringstittel, {
            antall: periodeNummer.toString(),
        }),
        verdi: sammeVerdiAlleSpråk({
            barnehageplassPeriodeBeskrivelse: {
                label: tilRestLocaleRecord(barnehageplassTekster.periodebeskrivelse.sporsmal),
                verdi: tilRestLocaleRecord(
                    hentBarnehageplassBeskrivelse(
                        barnehageplassPeriodeBeskrivelse.svar,
                        barnehageplassTekster
                    )
                ),
            },
            barnehageplassUtlandet: {
                label: tilRestLocaleRecord(barnehageplassTekster.utland.sporsmal),
                verdi: sammeVerdiAlleSpråk(barnehageplassUtlandet.svar),
            },
            barnehageplassLand: barnehageplassLand.svar
                ? {
                      label: tilRestLocaleRecord(barnehageplassTekster.hvilketLand.sporsmal),
                      verdi: verdiCallbackAlleSpråk(
                          locale =>
                              barnehageplassLand &&
                              landkodeTilSpråk(barnehageplassLand.svar, locale)
                      ),
                  }
                : null,
            offentligStøtte: offentligStøtte.svar
                ? {
                      label: tilRestLocaleRecord(barnehageplassTekster.offentligStoette.sporsmal),
                      verdi: sammeVerdiAlleSpråk(offentligStøtte.svar),
                  }
                : null,
            antallTimer: {
                label: tilRestLocaleRecord(barnehageplassTekster.antallTimer.sporsmal),
                verdi: sammeVerdiAlleSpråk(antallTimer.svar),
            },
            startetIBarnehagen: {
                label: tilRestLocaleRecord(
                    hentFraDatoSpørsmål(
                        barnehageplassPeriodeBeskrivelse.svar,
                        barnehageplassTekster
                    )
                ),
                verdi: sammeVerdiAlleSpråk(startetIBarnehagen.svar),
            },
            slutterIBarnehagen: {
                label: tilRestLocaleRecord(
                    hentTilDatoSpørsmål(
                        barnehageplassPeriodeBeskrivelse.svar,
                        barnehageplassTekster
                    )
                ),
                verdi: sammeVerdiAlleSpråkEllerUkjent(
                    tilRestLocaleRecord,
                    slutterIBarnehagen.svar,
                    barnehageplassTekster.sluttdatoFremtid.checkboxLabel
                ),
            },
        }),
    };
};
