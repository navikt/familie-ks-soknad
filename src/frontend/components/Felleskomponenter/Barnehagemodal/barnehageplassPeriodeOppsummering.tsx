import React from 'react';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';

interface BarnehageplassPeriodeProps {
    barnehageplassPeriode: IBarnehageplassPeriode;
    nummer: number;
    fjernPeriodeCallback?: (barnehageplassPeriode: IBarnehageplassPeriode) => void;
    barnetsNavn: string;
}

export const BarnehageplassPeriodeOppsummering: React.FC<BarnehageplassPeriodeProps> = ({
    barnehageplassPeriode,
    nummer,
    fjernPeriodeCallback = undefined,
    barnetsNavn,
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

    const spørsmålSpråkTekst = (spørsmålId: BarnehageplassPeriodeSpørsmålId) => (
        <SpråkTekst id={spørsmålId} values={{ barn: barnetsNavn }} />
    );

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnehageplassPeriode))
            }
            fjernKnappSpråkId={'todo.ombarnet.barnehageplass.periode'}
            nummer={nummer}
            tittelSpråkId={'todo.ombarnet.barnehageplass.periode'}
        >
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(
                    BarnehageplassPeriodeSpørsmålId.barnehageplassPeriodeBeskrivelse
                )}
                søknadsvar={barnehageplassPeriodeBeskrivelse.svar}
            />

            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.barnehageplassUtlandet)}
                søknadsvar={barnehageplassUtlandet.svar}
            />
            {barnehageplassLand.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.barnehageplassLand)}
                    søknadsvar={landkodeTilSpråk(barnehageplassLand.svar, valgtLocale)}
                />
            )}
            {offentligStøtte.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.offentligStøtte)}
                    søknadsvar={offentligStøtte.svar}
                />
            )}
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.antallTimer)}
                søknadsvar={antallTimer.svar}
            />

            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.startetIBarnehagen)}
                søknadsvar={formaterDato(startetIBarnehagen.svar)}
            />
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnehageplassPeriodeSpørsmålId.slutterIBarnehagen)}
                søknadsvar={formaterDato(slutterIBarnehagen.svar)}
            />
        </PeriodeOppsummering>
    );
};
