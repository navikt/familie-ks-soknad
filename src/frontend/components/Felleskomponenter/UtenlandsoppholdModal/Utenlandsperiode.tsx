import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
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
    fjernPeriodeUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    registrerteUtenlandsperioder: Felt<IUtenlandsperiode[]>;
};

export const Utenlandsperiode: React.FC<Props> = ({
    skjema,
    leggTilUtenlandsperiode,
    fjernPeriodeUtenlandsperiode,
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

    const teksterForPersontype = () => {
        // todo: rekfatorer persontype så vi slipper denne
        switch (personType) {
            case PersonType.barn:
                return utenlandsopphold.barn;
            case PersonType.andreForelder:
                return utenlandsopphold.andreForelder;
            case PersonType.søker:
            default:
                return utenlandsopphold.søker;
        }
    };

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
                    fjernPeriodeCallback={fjernPeriodeUtenlandsperiode}
                    personType={personType}
                    barn={barn}
                />
            ))}
            {registrerteUtenlandsperioder.verdi.length > 0 && (
                <Element>
                    <TekstBlock block={teksterForPersontype().flerePerioder} />
                </Element>
            )}
            <LeggTilKnapp
                id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                onClick={toggleModal}
                feilmelding={
                    registrerteUtenlandsperioder.erSynlig &&
                    registrerteUtenlandsperioder.feilmelding &&
                    skjema.visFeilmeldinger && (
                        <TekstBlock block={teksterForPersontype().leggTilFeilmelding} />
                    )
                }
            >
                <TekstBlock block={teksterForPersontype().leggTilKnapp} />
            </LeggTilKnapp>
        </>
    );
};
