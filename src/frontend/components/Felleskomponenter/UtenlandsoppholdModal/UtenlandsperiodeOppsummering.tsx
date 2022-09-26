import React from 'react';

import { useIntl } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';
import { tilDatoUkjentLabelSpråkId } from './spørsmål';
import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    utenlandsoppholdÅrsakTilTekst,
} from './utenlandsoppholdSpråkUtils';

type Props = {
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
    personType: PersonType;
    barn?: IBarnMedISøknad;
};

export const UtenlandsperiodeOppsummering: React.FC<Props> = ({
    periode,
    nummer,
    fjernPeriodeCallback,
    barn,
    personType,
}) => {
    const [valgtLocale] = useSprakContext();
    const { localeString, tekster } = useApp();
    const intl = useIntl();
    const { formatMessage } = intl;
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
                        {localeString(utenlandsoppholdÅrsakTilTekst(årsak, teksterForPersonType))}
                    </Normaltekst>
                </OppsummeringFelt>

                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={hentLandSpørsmål(
                                utenlandsoppholdÅrsak.svar,
                                teksterForPersonType
                            )}
                            barnetsNavn={barn && barn.navn}
                        />
                    }
                    søknadsvar={landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
                />

                {oppholdslandFraDato && (
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={hentFraDatoSpørsmål(årsak, teksterForPersonType)}
                                barnetsNavn={barn?.navn}
                            />
                        }
                        søknadsvar={formaterDato(oppholdslandFraDato.svar)}
                    />
                )}

                {oppholdslandTilDato && (
                    <OppsummeringFelt
                        tittel={
                            <TekstBlock
                                block={hentTilDatoSpørsmål(årsak, teksterForPersonType)}
                                barnetsNavn={barn?.navn}
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
