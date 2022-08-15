import { BarnehageplassPeriodeSpørsmålId } from '../../components/Felleskomponenter/Barnehagemodal/spørsmål';
import { ISøknadsfelt } from '../../typer/kontrakt/generelle';
import { IBarnehageplassPeriodeIKontraktFormat } from '../../typer/kontrakt/v1';
import { IBarnehageplassPeriode } from '../../typer/perioder';
import { hentTekster, landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

interface BarnehageplassperiodeIKontraktFormatParams {
    periode: IBarnehageplassPeriode;
    periodeNummer: number;
}

export const tilIBarnehageplassPeriodeIKontraktFormat = ({
    periode,
    periodeNummer,
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
        label: hentTekster('todo.ombarnet.barnehageplass.periode', {
            x: periodeNummer,
        }),
        verdi: sammeVerdiAlleSpråk({
            barnehageplassPeriodeBeskrivelse: {
                label: hentTekster(
                    BarnehageplassPeriodeSpørsmålId.barnehageplassPeriodeBeskrivelse
                ),
                verdi: sammeVerdiAlleSpråk(barnehageplassPeriodeBeskrivelse.svar),
            },
            barnehageplassUtlandet: {
                label: hentTekster(BarnehageplassPeriodeSpørsmålId.barnehageplassUtlandet),
                verdi: sammeVerdiAlleSpråk(barnehageplassUtlandet.svar),
            },
            barnehageplassLand: barnehageplassLand.svar
                ? {
                      label: hentTekster(BarnehageplassPeriodeSpørsmålId.barnehageplassLand),
                      verdi: verdiCallbackAlleSpråk(
                          locale =>
                              barnehageplassLand &&
                              landkodeTilSpråk(barnehageplassLand.svar, locale)
                      ),
                  }
                : null,
            offentligStøtte: {
                label: hentTekster(BarnehageplassPeriodeSpørsmålId.offentligStøtte),
                verdi: sammeVerdiAlleSpråk(offentligStøtte.svar),
            },
            antallTimer: {
                label: hentTekster(BarnehageplassPeriodeSpørsmålId.antallTimer),
                verdi: sammeVerdiAlleSpråk(antallTimer.svar),
            },
            startetIBarnehagen: {
                label: hentTekster(BarnehageplassPeriodeSpørsmålId.startetIBarnehagen),
                verdi: sammeVerdiAlleSpråk(startetIBarnehagen.svar),
            },
            slutterIBarnehagen: {
                label: hentTekster(BarnehageplassPeriodeSpørsmålId.slutterIBarnehagen),
                verdi: sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    slutterIBarnehagen.svar,
                    BarnehageplassPeriodeSpørsmålId.slutterIBarnehagenVetIkke
                ),
            },
        }),
    };
};
