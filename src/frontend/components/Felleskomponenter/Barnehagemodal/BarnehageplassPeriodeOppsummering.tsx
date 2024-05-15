import React from 'react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { formaterDato, formaterDatoMedUkjent } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import { useSpråk } from '../Dekoratøren/SpråkContext';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';

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

    const { valgtLocale } = useSpråk();
    const { tekster, plainTekst } = useApp();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster().FELLES.modaler.barnehageplass;
    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnehageplassPeriode))
            }
            fjernKnappTekst={barnehageplassTekster.fjernKnapp}
            tittel={
                <TekstBlock
                    block={barnehageplassTekster.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString() }}
                    typografi={Typografi.HeadingH2}
                />
            }
        >
            <OppsummeringFelt
                spørsmålstekst={barnehageplassTekster.periodebeskrivelse.sporsmal}
                søknadsvar={plainTekst(
                    hentBarnehageplassBeskrivelse(
                        barnehageplassPeriodeBeskrivelse.svar,
                        barnehageplassTekster
                    )
                )}
            />

            <OppsummeringFelt
                spørsmålstekst={barnehageplassTekster.utland.sporsmal}
                søknadsvar={barnehageplassUtlandet.svar}
            />
            {barnehageplassLand.svar && (
                <OppsummeringFelt
                    spørsmålstekst={barnehageplassTekster.hvilketLand.sporsmal}
                    søknadsvar={landkodeTilSpråk(barnehageplassLand.svar, valgtLocale)}
                />
            )}
            {offentligStøtte.svar && (
                <OppsummeringFelt
                    spørsmålstekst={barnehageplassTekster.offentligStoette.sporsmal}
                    søknadsvar={offentligStøtte.svar}
                />
            )}
            <OppsummeringFelt
                spørsmålstekst={barnehageplassTekster.antallTimer.sporsmal}
                søknadsvar={antallTimer.svar}
            />

            <OppsummeringFelt
                spørsmålstekst={
                    barnehageplassPeriodeBeskrivelse.svar ===
                    EBarnehageplassPeriodeBeskrivelse.TILDELT_BARNEHAGEPLASS_I_FREMTIDEN
                        ? barnehageplassTekster.startdatoFremtid.sporsmal
                        : barnehageplassTekster.startdatoFortid.sporsmal
                }
                søknadsvar={formaterDato(startetIBarnehagen.svar)}
            />
            <OppsummeringFelt
                spørsmålstekst={
                    barnehageplassPeriodeBeskrivelse.svar ===
                    EBarnehageplassPeriodeBeskrivelse.HATT_BARNEHAGEPLASS_TIDLIGERE
                        ? barnehageplassTekster.sluttdatoFortid.sporsmal
                        : barnehageplassTekster.sluttdatoFremtid.sporsmal
                }
                søknadsvar={formaterDatoMedUkjent(
                    slutterIBarnehagen.svar,
                    plainTekst(barnehageplassTekster.sluttdatoFremtid.checkboxLabel)
                )}
            />
        </PeriodeOppsummering>
    );
};
