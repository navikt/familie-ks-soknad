import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { formaterDato, formaterDatoMedUkjent } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';
import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from './utenlandsoppholdSpråkUtils';

type Props = {
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
    personType: PersonType;
};

export const UtenlandsperiodeOppsummering: React.FC<Props> = ({
    periode,
    nummer,
    fjernPeriodeCallback,
    personType,
}) => {
    const [valgtLocale] = useSprakContext();
    const { plainTekst, tekster } = useApp();
    const { oppholdsland, utenlandsoppholdÅrsak, oppholdslandFraDato, oppholdslandTilDato } =
        periode;
    const årsak = utenlandsoppholdÅrsak.svar;
    const teksterForPersonType = tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    return (
        <>
            <PeriodeOppsummering
                nummer={nummer}
                tittelSpråkId={'felles.leggtilutenlands.opphold'}
                fjernKnappSpråkId={'felles.fjernutenlandsopphold.knapp'}
                fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(periode))}
            >
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForPersonType.periodeBeskrivelse.sporsmal} />}
                >
                    <Normaltekst>
                        {plainTekst(hentUtenlandsoppholdÅrsak(årsak, teksterForPersonType))}
                    </Normaltekst>
                </OppsummeringFelt>

                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={hentLandSpørsmål(
                                utenlandsoppholdÅrsak.svar,
                                teksterForPersonType
                            )}
                        />
                    }
                    søknadsvar={landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
                />

                {oppholdslandFraDato && (
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={hentFraDatoSpørsmål(årsak, teksterForPersonType)} />
                        }
                        søknadsvar={formaterDato(oppholdslandFraDato.svar)}
                    />
                )}

                {oppholdslandTilDato && (
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock block={hentTilDatoSpørsmål(årsak, teksterForPersonType)} />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            oppholdslandTilDato.svar,
                            plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)
                        )}
                    />
                )}
            </PeriodeOppsummering>
        </>
    );
};
