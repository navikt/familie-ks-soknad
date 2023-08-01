import React from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { UtenlandsoppholdModal } from './UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from './UtenlandsperiodeOppsummering';
import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IDinLivssituasjonFeltTyper, IOmBarnetFeltTyper } from '../../../typer/skjema';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

type Props = PeriodePersonTypeMedBarnProps & {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetFeltTyper, string>;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    registrerteUtenlandsperioder: Felt<IUtenlandsperiode[]>;
};

export const Utenlandsperiode: React.FC<Props> = ({
    skjema,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
    registrerteUtenlandsperioder,
    barn,
    personType,
}) => {
    const { tekster } = useApp();
    const { erÅpen, toggleModal } = useModal();

    const {
        [ESanitySteg.FELLES]: {
            modaler: { utenlandsopphold },
        },
    } = tekster();

    const { flerePerioder, leggTilKnapp } = utenlandsopphold[personType];

    return (
        <>
            <UtenlandsoppholdModal
                erÅpen={erÅpen}
                toggleModal={toggleModal}
                onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                personType={personType}
                barn={personType !== PersonType.søker ? barn : undefined}
            />
            {registrerteUtenlandsperioder.verdi.map((periode, index) => (
                <UtenlandsperiodeOppsummering
                    key={index}
                    periode={periode}
                    nummer={index + 1}
                    fjernPeriodeCallback={fjernUtenlandsperiode}
                    personType={personType}
                    barn={personType !== PersonType.søker ? barn : undefined}
                />
            ))}
            {registrerteUtenlandsperioder.verdi.length > 0 && (
                <TekstBlock block={flerePerioder} typografi={Typografi.Label} />
            )}
            <LeggTilKnapp
                id={registrerteUtenlandsperioder.id}
                onClick={toggleModal}
                feilmelding={
                    registrerteUtenlandsperioder.erSynlig &&
                    skjema.visFeilmeldinger &&
                    registrerteUtenlandsperioder.feilmelding
                }
            >
                <TekstBlock block={leggTilKnapp} />
            </LeggTilKnapp>
        </>
    );
};
