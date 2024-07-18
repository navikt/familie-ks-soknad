import React from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IDinLivssituasjonFeltTyper, IOmBarnetFeltTyper } from '../../../typer/skjema';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

import { UtenlandsoppholdModal } from './UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from './UtenlandsperiodeOppsummering';

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
    const { tekster, plainTekst } = useApp();
    const {
        erÅpen: erUtenlandsoppholdModalÅpen,
        lukkModal: lukkUtenlandsoppholdModal,
        åpneModal: åpneUtenlandsoppholdModal,
    } = useModal();
    const { toggles } = useFeatureToggles();

    const {
        [ESanitySteg.FELLES]: {
            modaler: { utenlandsopphold },
        },
    } = tekster();

    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = utenlandsopphold[personType];

    return (
        <PerioderContainer>
            {erUtenlandsoppholdModalÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={erUtenlandsoppholdModalÅpen}
                    lukkModal={lukkUtenlandsoppholdModal}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                    personType={personType}
                    barn={personType !== PersonType.søker ? barn : undefined}
                    forklaring={plainTekst(leggTilPeriodeForklaring)}
                />
            )}
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

            <LeggTilKnapp
                id={registrerteUtenlandsperioder.id}
                onClick={åpneUtenlandsoppholdModal}
                forklaring={
                    registrerteUtenlandsperioder.verdi.length > 0
                        ? plainTekst(flerePerioder)
                        : toggles.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP &&
                            leggTilPeriodeForklaring
                          ? plainTekst(leggTilPeriodeForklaring)
                          : undefined
                }
                feilmelding={
                    registrerteUtenlandsperioder.erSynlig &&
                    skjema.visFeilmeldinger &&
                    registrerteUtenlandsperioder.feilmelding
                }
            >
                <TekstBlock block={leggTilKnapp} />
            </LeggTilKnapp>
        </PerioderContainer>
    );
};
