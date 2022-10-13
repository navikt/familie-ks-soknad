import React from 'react';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import { hentBarnehageplassBeskrivelse } from './barnehageplassSpråkUtils';
import { EBarnehageplassPeriodeBeskrivelse } from './barnehageplassTyper';

interface BarnehageplassPeriodeProps {
    barnehageplassPeriode: IBarnehageplassPeriode;
    nummer: number;
    fjernPeriodeCallback?: (barnehageplassPeriode: IBarnehageplassPeriode) => void;
}

export const BarnehageplassPeriodeOppsummering: React.FC<BarnehageplassPeriodeProps> = ({
    barnehageplassPeriode,
    nummer,
    fjernPeriodeCallback = undefined,
}) => {
    const {
        barnehageplassPeriodeBeskrivelse,
        barnehageplassUtlandet,
        barnehageplassLand,
        offentligStøtte,
        antallTimer,
        startetIBarnehagen,
        slutterIBarnehagen,
    } = barnehageplassPeriode;

    const [valgtLocale] = useSprakContext();
    const { tekster, plainTekst } = useApp();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnehageplassPeriode))
            }
            fjernKnappTekst={barnehageplassTekster.fjernKnapp}
            nummer={nummer}
            tittelSpråkId={'todo.ombarnet.barnehageplass.periode'}
        >
            <OppsummeringFelt
                tittel={plainTekst(barnehageplassTekster.periodebeskrivelse.sporsmal)}
                søknadsvar={plainTekst(
                    hentBarnehageplassBeskrivelse(
                        barnehageplassPeriodeBeskrivelse.svar,
                        barnehageplassTekster
                    )
                )}
            />

            <OppsummeringFelt
                tittel={plainTekst(barnehageplassTekster.utland.sporsmal)}
                søknadsvar={barnehageplassUtlandet.svar}
            />
            {barnehageplassLand.svar && (
                <OppsummeringFelt
                    tittel={plainTekst(barnehageplassTekster.hvilketLand.sporsmal)}
                    søknadsvar={landkodeTilSpråk(barnehageplassLand.svar, valgtLocale)}
                />
            )}
            {offentligStøtte.svar && (
                <OppsummeringFelt
                    tittel={plainTekst(barnehageplassTekster.offentligStoette.sporsmal)}
                    søknadsvar={offentligStøtte.svar}
                />
            )}
            <OppsummeringFelt
                tittel={plainTekst(barnehageplassTekster.antallTimer.sporsmal)}
                søknadsvar={antallTimer.svar}
            />

            <OppsummeringFelt
                tittel={
                    barnehageplassPeriodeBeskrivelse.svar ===
                    EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN
                        ? plainTekst(barnehageplassTekster.startdatoFremtid.sporsmal)
                        : plainTekst(barnehageplassTekster.startdatoFortid.sporsmal)
                }
                søknadsvar={formaterDato(startetIBarnehagen.svar)}
            />
            <OppsummeringFelt
                tittel={
                    barnehageplassPeriodeBeskrivelse.svar ===
                    EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                        ? plainTekst(barnehageplassTekster.sluttdatoFortid.sporsmal)
                        : plainTekst(barnehageplassTekster.sluttdatoFremtid.sporsmal)
                }
                søknadsvar={formaterDato(slutterIBarnehagen.svar)}
            />
        </PeriodeOppsummering>
    );
};
