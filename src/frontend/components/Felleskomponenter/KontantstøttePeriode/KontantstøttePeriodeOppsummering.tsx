import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IEøsYtelseTekstinnhold } from '../../../typer/sanity/modaler/eøsYtelse';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';

interface KontantstøttePeriodeProps {
    kontantstøttePeriode: IEøsKontantstøttePeriode;
    nummer: number;
    fjernPeriodeCallback?: (kontantstøttePeriode: IEøsKontantstøttePeriode) => void;
    barnetsNavn: string;
}

type KontantstøttePeriodeOppsummeringPersonTypeProps =
    | { personType: PersonType.søker; erDød?: boolean }
    | { personType: PersonType.omsorgsperson; erDød?: boolean }
    | { personType: PersonType.andreForelder; erDød: boolean };

type Props = KontantstøttePeriodeProps & KontantstøttePeriodeOppsummeringPersonTypeProps;

export const KontantstøttePeriodeOppsummering: React.FC<Props> = ({
    kontantstøttePeriode,
    nummer,
    fjernPeriodeCallback = undefined,
    barnetsNavn,
    erDød,
    personType,
}) => {
    const { tekster } = useApp();

    const teksterForPersonType: IEøsYtelseTekstinnhold =
        tekster().FELLES.modaler.eøsYtelse[personType];

    const {
        mottarEøsKontantstøtteNå,
        kontantstøtteLand,
        fraDatoKontantstøttePeriode,
        tilDatoKontantstøttePeriode,
        månedligBeløp,
    } = kontantstøttePeriode;

    const periodenErAvsluttet =
        mottarEøsKontantstøtteNå.svar === ESvar.NEI ||
        (personType === PersonType.andreForelder && erDød);
    const { valgtLocale } = useSpråkContext();

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(kontantstøttePeriode))
            }
            fjernKnappTekst={teksterForPersonType.fjernKnapp}
            tittel={
                <TekstBlock
                    block={teksterForPersonType.oppsummeringstittelKontantstoette}
                    flettefelter={{ antall: nummer.toString() }}
                />
            }
        >
            {mottarEøsKontantstøtteNå.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={teksterForPersonType.faarYtelserNaa.sporsmal}
                            flettefelter={{ barnetsNavn }}
                        />
                    }
                    søknadsvar={mottarEøsKontantstøtteNå.svar}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={
                            periodenErAvsluttet
                                ? teksterForPersonType.ytelseLandFortid.sporsmal
                                : teksterForPersonType.ytelseLandNaatid.sporsmal
                        }
                        flettefelter={{ barnetsNavn }}
                    />
                }
                søknadsvar={landkodeTilSpråk(kontantstøtteLand.svar, valgtLocale)}
            />
            <OppsummeringFelt
                tittel={<TekstBlock block={teksterForPersonType.startdato.sporsmal} />}
                søknadsvar={formaterDato(fraDatoKontantstøttePeriode.svar)}
            />
            {tilDatoKontantstøttePeriode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForPersonType.sluttdato.sporsmal} />}
                    søknadsvar={formaterDato(tilDatoKontantstøttePeriode.svar)}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={teksterForPersonType.beloepPerMaaned.sporsmal}
                        flettefelter={{ barnetsNavn }}
                    />
                }
                søknadsvar={månedligBeløp.svar}
            />
        </PeriodeOppsummering>
    );
};
