import React from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetUtvidetFeltTyper, IOmDegFeltTyper } from '../../../typer/skjema';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import { UtenlandsoppholdModal } from './UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from './UtenlandsperiodeOppsummering';

type PersonTypeMedBarn =
    | { personType: PersonType.søker; barn?: never }
    | { personType: PersonType.barn; barn: IBarnMedISøknad }
    | { personType: PersonType.andreForelder; barn: IBarnMedISøknad };

type Props = PersonTypeMedBarn & {
    skjema: ISkjema<IOmDegFeltTyper | IOmBarnetUtvidetFeltTyper, string>;
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

    const { flerePerioder, leggTilFeilmelding, leggTilKnapp } = utenlandsopphold[personType];

    return (
        <>
            <UtenlandsoppholdModal
                erÅpen={erÅpen}
                toggleModal={toggleModal}
                onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                personType={personType}
                barn={barn}
            />
            {registrerteUtenlandsperioder.verdi.map((periode, index) => (
                <UtenlandsperiodeOppsummering
                    key={index}
                    periode={periode}
                    nummer={index + 1}
                    fjernPeriodeCallback={fjernUtenlandsperiode}
                    personType={personType}
                />
            ))}
            {registrerteUtenlandsperioder.verdi.length > 0 && (
                <TekstBlock block={flerePerioder} typografi={Typografi.Label} />
            )}
            <LeggTilKnapp
                id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                onClick={toggleModal}
                feilmelding={
                    registrerteUtenlandsperioder.erSynlig &&
                    registrerteUtenlandsperioder.feilmelding &&
                    skjema.visFeilmeldinger && (
                        <TekstBlock block={leggTilFeilmelding} typografi={Typografi.ErrorMessage} />
                    )
                }
            >
                <TekstBlock block={leggTilKnapp} />
            </LeggTilKnapp>
        </>
    );
};
