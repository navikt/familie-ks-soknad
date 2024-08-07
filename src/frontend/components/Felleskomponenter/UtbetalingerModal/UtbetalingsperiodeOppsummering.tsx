import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { Typografi } from '../../../typer/common';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IAndreUtbetalingerTekstinnhold } from '../../../typer/sanity/modaler/andreUtbetalinger';
import { formaterDato, formaterDatoMedUkjent } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';

interface Props {
    utbetalingsperiode: IUtbetalingsperiode;
    nummer: number;
    fjernPeriodeCallback?: (utbetalingsperiode: IUtbetalingsperiode) => void;
}

type UtbetalingsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const UtbetalingsperiodeOppsummering: React.FC<UtbetalingsperiodeOppsummeringProps> = ({
    utbetalingsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    personType,
    erDød = false,
    barn = undefined,
}) => {
    const { tekster, plainTekst } = useApp();
    const { valgtLocale } = useSpråk();
    const { fårUtbetalingNå, utbetalingLand, utbetalingFraDato, utbetalingTilDato } =
        utbetalingsperiode;

    const teksterForPersontype: IAndreUtbetalingerTekstinnhold =
        tekster().FELLES.modaler.andreUtbetalinger[personType];

    const periodenErAvsluttet =
        fårUtbetalingNå?.svar === ESvar.NEI || (personType === PersonType.andreForelder && erDød);

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(utbetalingsperiode))
            }
            fjernKnappTekst={teksterForPersontype.fjernKnapp}
            tittel={
                <TekstBlock
                    block={teksterForPersontype.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString() }}
                    typografi={Typografi.HeadingH3}
                />
            }
        >
            {fårUtbetalingNå.svar && (
                <OppsummeringFelt
                    spørsmålstekst={teksterForPersontype.faarUtbetalingerNaa.sporsmal}
                    søknadsvar={fårUtbetalingNå.svar}
                    flettefelter={{ barnetsNavn: barn?.navn }}
                />
            )}
            <OppsummeringFelt
                spørsmålstekst={
                    periodenErAvsluttet
                        ? teksterForPersontype.utbetalingLandFortid.sporsmal
                        : teksterForPersontype.utbetalingLandNaatid.sporsmal
                }
                flettefelter={{ barnetsNavn: barn?.navn }}
                søknadsvar={landkodeTilSpråk(utbetalingLand.svar, valgtLocale)}
            />
            <OppsummeringFelt
                spørsmålstekst={teksterForPersontype.startdato.sporsmal}
                søknadsvar={formaterDato(utbetalingFraDato.svar)}
            />
            <OppsummeringFelt
                spørsmålstekst={
                    periodenErAvsluttet
                        ? teksterForPersontype.sluttdatoFortid.sporsmal
                        : teksterForPersontype.sluttdatoFremtid.sporsmal
                }
                søknadsvar={formaterDatoMedUkjent(
                    utbetalingTilDato.svar,
                    plainTekst(teksterForPersontype.sluttdatoFremtid.checkboxLabel)
                )}
            />
        </PeriodeOppsummering>
    );
};
