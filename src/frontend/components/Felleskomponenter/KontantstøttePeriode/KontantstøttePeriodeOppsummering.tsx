import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { kontantstøttePeriodeModalSpørsmålSpråkId } from './kontantstøttePeriodeSpråkUtils';
import { KontantstøttePeriodeSpørsmålId } from './spørsmål';

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
    const [valgtLocale] = useSprakContext();

    const hentSpørsmålTekstId = kontantstøttePeriodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const spørsmålSpråkTekst = (spørsmålId: KontantstøttePeriodeSpørsmålId) => (
        <SpråkTekst id={hentSpørsmålTekstId(spørsmålId)} values={{ barn: barnetsNavn }} />
    );

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(kontantstøttePeriode))
            }
            fjernKnappSpråkId={'felles.fjernbarnetrygd.knapp'}
            nummer={nummer}
            tittelSpråkId={'ombarnet.trygdandreperioder.periode'}
        >
            {mottarEøsKontantstøtteNå.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(
                        KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå
                    )}
                    søknadsvar={mottarEøsKontantstøtteNå.svar}
                />
            )}
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(KontantstøttePeriodeSpørsmålId.kontantstøtteLand)}
                søknadsvar={landkodeTilSpråk(kontantstøtteLand.svar, valgtLocale)}
            />
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(
                    KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode
                )}
                søknadsvar={formaterDato(fraDatoKontantstøttePeriode.svar)}
            />
            {tilDatoKontantstøttePeriode.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(
                        KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode
                    )}
                    søknadsvar={formaterDato(tilDatoKontantstøttePeriode.svar)}
                />
            )}
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(KontantstøttePeriodeSpørsmålId.månedligBeløp)}
                søknadsvar={månedligBeløp.svar}
            />
        </PeriodeOppsummering>
    );
};
