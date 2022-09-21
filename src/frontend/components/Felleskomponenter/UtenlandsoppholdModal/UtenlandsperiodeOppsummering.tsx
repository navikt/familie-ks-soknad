import React from 'react';

import { useIntl } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { tilDatoUkjentLabelSpråkId } from './spørsmål';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    årsakLabelSpråkId,
    årsakSpråkId,
} from './utenlandsoppholdSpråkUtils';

type PersonTypeMedBarn =
    | { personType: PersonType.søker; barn?: never }
    | { personType: PersonType.barn; barn: IBarnMedISøknad }
    | { personType: PersonType.andreForelder; barn: IBarnMedISøknad };

type Props = PersonTypeMedBarn & {
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
};

export const UtenlandsperiodeOppsummering: React.FC<Props> = ({
    periode,
    nummer,
    fjernPeriodeCallback,
    barn,
    personType,
}) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { formatMessage } = intl;
    const { oppholdsland, utenlandsoppholdÅrsak, oppholdslandFraDato, oppholdslandTilDato } =
        periode;
    const årsak = utenlandsoppholdÅrsak.svar;

    return (
        <>
            <PeriodeOppsummering
                nummer={nummer}
                tittelSpråkId={'felles.leggtilutenlands.opphold'}
                fjernKnappSpråkId={'felles.fjernutenlandsopphold.knapp'}
                fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(periode))}
            >
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={årsakLabelSpråkId(personType)}
                            values={{ barn: barn ? barn.navn : undefined }}
                        />
                    }
                >
                    <Normaltekst>
                        <SpråkTekst
                            id={årsakSpråkId(årsak, personType)}
                            values={{ barn: barn ? barn.navn : undefined }}
                        />
                    </Normaltekst>
                </OppsummeringFelt>

                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={landLabelSpråkId(årsak, personType)}
                            values={{ barn: barn ? barn.navn : undefined }}
                        />
                    }
                    søknadsvar={landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
                />

                {oppholdslandFraDato && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={fraDatoLabelSpråkId(årsak, personType)}
                                values={{ barn: barn ? barn.navn : undefined }}
                            />
                        }
                        søknadsvar={formaterDato(oppholdslandFraDato.svar)}
                    />
                )}

                {oppholdslandTilDato && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={tilDatoLabelSpråkId(årsak, personType)}
                                values={{ barn: barn ? barn.navn : undefined }}
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            oppholdslandTilDato.svar,
                            formatMessage({ id: tilDatoUkjentLabelSpråkId })
                        )}
                    />
                )}
            </PeriodeOppsummering>
        </>
    );
};
