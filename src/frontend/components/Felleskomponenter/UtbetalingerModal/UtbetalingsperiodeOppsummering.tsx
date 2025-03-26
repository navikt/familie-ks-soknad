import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IAndreUtbetalingerTekstinnhold } from '../../../typer/sanity/modaler/andreUtbetalinger';
import { formaterDato, formaterDatostringKunMåned } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterMånedMedUkjent, uppercaseFørsteBokstav } from '../../../utils/visning';
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
    const { toggles } = useFeatureToggles();
    const { tekster, plainTekst } = useApp();
    const { valgtLocale } = useSpråkContext();
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
                />
            }
        >
            {fårUtbetalingNå.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={teksterForPersontype.faarUtbetalingerNaa.sporsmal}
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    søknadsvar={fårUtbetalingNå.svar}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={
                            periodenErAvsluttet
                                ? teksterForPersontype.utbetalingLandFortid.sporsmal
                                : teksterForPersontype.utbetalingLandNaatid.sporsmal
                        }
                        flettefelter={{ barnetsNavn: barn?.navn }}
                    />
                }
                søknadsvar={landkodeTilSpråk(utbetalingLand.svar, valgtLocale)}
            />
            <OppsummeringFelt
                tittel={<TekstBlock block={teksterForPersontype.startdato.sporsmal} />}
                søknadsvar={
                    toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
                        ? uppercaseFørsteBokstav(
                              formaterDatostringKunMåned(utbetalingFraDato.svar, valgtLocale)
                          )
                        : formaterDato(utbetalingFraDato.svar)
                }
            />
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={
                            periodenErAvsluttet
                                ? teksterForPersontype.sluttdatoFortid.sporsmal
                                : teksterForPersontype.sluttdatoFremtid.sporsmal
                        }
                    />
                }
                søknadsvar={formaterMånedMedUkjent(
                    utbetalingTilDato.svar,
                    plainTekst(teksterForPersontype.sluttdatoFremtid.checkboxLabel),
                    toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO],
                    valgtLocale
                )}
            />
        </PeriodeOppsummering>
    );
};
