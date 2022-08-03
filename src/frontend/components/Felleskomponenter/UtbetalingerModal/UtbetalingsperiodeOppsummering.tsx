import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { utbetalingsperiodeModalSpørsmålSpråkIder } from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';

interface Props {
    utbetalingsperiode: IUtbetalingsperiode;
    nummer: number;
    fjernPeriodeCallback?: (utbetalingsperiode: IUtbetalingsperiode) => void;
}

type UtbetalingsperiodeOppsummeringPersonTypeProps =
    | { personType: PersonType.Søker; erDød?: boolean; barn?: IBarnMedISøknad | undefined }
    | { personType: PersonType.Omsorgsperson; erDød?: boolean; barn: IBarnMedISøknad | undefined }
    | { personType: PersonType.AndreForelder; erDød: boolean; barn: IBarnMedISøknad | undefined };

type UtbetalingsperiodeOppsummeringProps = Props & UtbetalingsperiodeOppsummeringPersonTypeProps;

export const UtbetalingsperiodeOppsummering: React.FC<UtbetalingsperiodeOppsummeringProps> = ({
    utbetalingsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    personType,
    erDød = false,
    barn = undefined,
}) => {
    const [valgtLocale] = useSprakContext();
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } =
        utbetalingsperiode;

    const periodenErAvsluttet =
        fårUtbetalingNå?.svar === ESvar.NEI || (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = utbetalingsperiodeModalSpørsmålSpråkIder(
        personType,
        periodenErAvsluttet
    );

    const utbetalingerSpørsmålSpråkTekst = (spørsmålId: UtbetalingerSpørsmålId) => (
        <SpråkTekst
            id={hentSpørsmålTekstId(spørsmålId)}
            values={{
                ...(barn && { barn: barn.navn }),
            }}
        />
    );

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(utbetalingsperiode))
            }
            fjernKnappSpråkId={'felles.fjernytelse.knapp'}
            nummer={nummer}
            tittelSpråkId={'felles.flereytelser.periode'}
        >
            {fårUtbetalingNå.svar && (
                <OppsummeringFelt
                    tittel={utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.fårUtbetalingNå)}
                    søknadsvar={fårUtbetalingNå.svar}
                />
            )}
            <OppsummeringFelt
                tittel={utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.utbetalingLand)}
                søknadsvar={landkodeTilSpråk(utbetalingLand.svar, valgtLocale)}
            />
            <OppsummeringFelt
                tittel={utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.utbetalingFraDato)}
                søknadsvar={formaterDato(utbetalingFraDato.svar)}
            />
            <OppsummeringFelt
                tittel={utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.utbetalingTilDato)}
                søknadsvar={formaterDatoMedUkjent(
                    utbetalingTilDato.svar,
                    utbetalingerSpørsmålSpråkTekst(UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke)
                )}
            />
        </PeriodeOppsummering>
    );
};
