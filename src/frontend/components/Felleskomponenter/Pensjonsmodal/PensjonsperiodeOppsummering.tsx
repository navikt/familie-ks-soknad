import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { Typografi } from '../../../typer/common';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../TekstBlock';

interface Props {
    pensjonsperiode: IPensjonsperiode;
    nummer: number;
    fjernPeriodeCallback?: (pensjonsperiode: IPensjonsperiode) => void;
    gjelderUtlandet: boolean;
}

type PensjonsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const PensjonsperiodeOppsummering: React.FC<PensjonsperiodeOppsummeringProps> = ({
    pensjonsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    gjelderUtlandet,
    personType,
    erDød = false,
    barn = undefined,
}) => {
    const { valgtLocale } = useSpråk();
    const { tekster } = useApp();
    const teksterForModal = tekster().FELLES.modaler.pensjonsperiode[personType];

    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = pensjonsperiode;

    const periodenErAvsluttet =
        mottarPensjonNå?.svar === ESvar.NEI || (personType === PersonType.andreForelder && !!erDød);

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(pensjonsperiode))
            }
            fjernKnappTekst={teksterForModal.fjernKnapp}
            tittel={
                <TekstBlock
                    block={teksterForModal.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString(), gjelderUtland: gjelderUtlandet }}
                    typografi={Typografi.HeadingH3}
                />
            }
        >
            {mottarPensjonNå.svar && (
                <OppsummeringFelt
                    spørsmålstekst={teksterForModal.faarPensjonNaa.sporsmal}
                    søknadsvar={mottarPensjonNå.svar}
                    flettefelter={{ barnetsNavn: barn?.navn }}
                />
            )}
            {pensjonsland.svar && (
                <OppsummeringFelt
                    spørsmålstekst={
                        periodenErAvsluttet
                            ? teksterForModal.pensjonLandFortid.sporsmal
                            : teksterForModal.pensjonLandNaatid.sporsmal
                    }
                    søknadsvar={landkodeTilSpråk(pensjonsland.svar, valgtLocale)}
                    flettefelter={{ barnetsNavn: barn?.navn }}
                />
            )}
            {pensjonFra.svar && (
                <OppsummeringFelt
                    spørsmålstekst={teksterForModal.startdato.sporsmal}
                    søknadsvar={formaterDato(pensjonFra.svar)}
                />
            )}
            {pensjonTil.svar && (
                <OppsummeringFelt
                    spørsmålstekst={teksterForModal.sluttdato.sporsmal}
                    søknadsvar={formaterDato(pensjonTil.svar)}
                />
            )}
        </PeriodeOppsummering>
    );
};
