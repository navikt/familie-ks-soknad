import { LeggTilKnapp } from '@components/Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '@components/Felleskomponenter/PerioderContainer';
import useModal from '@components/Felleskomponenter/SkjemaModal/useModal';
import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import { useAppContext } from '@context/AppContext';
import type { Felt, ISkjema } from '@navikt/familie-skjema';
import type { IUtenlandsperiode } from '@typer/perioder';
import { type PeriodePersonTypeMedBarnProps, PersonType } from '@typer/personType';
import { ESanitySteg } from '@typer/sanity/sanity';
import type { IDinLivssituasjonFeltTyper, IOmBarnetFeltTyper } from '@typer/skjema';
import { uppercaseFørsteBokstav } from '@utils/visning';
import type { FC } from 'react';

import { UtenlandsoppholdModal } from './UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from './UtenlandsperiodeOppsummering';

type Props = PeriodePersonTypeMedBarnProps & {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetFeltTyper, string>;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    registrerteUtenlandsperioder: Felt<IUtenlandsperiode[]>;
};

export const Utenlandsperiode: FC<Props> = ({
    skjema,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
    registrerteUtenlandsperioder,
    barn,
    personType,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const {
        erÅpen: erUtenlandsoppholdModalÅpen,
        lukkModal: lukkUtenlandsoppholdModal,
        åpneModal: åpneUtenlandsoppholdModal,
    } = useModal();

    const {
        [ESanitySteg.FELLES]: {
            modaler: { utenlandsopphold },
        },
    } = tekster();

    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = utenlandsopphold[personType];

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <PerioderContainer tittel={uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.utenlandsopphold))}>
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
                leggTilFlereTekst={registrerteUtenlandsperioder.verdi.length > 0 && plainTekst(flerePerioder)}
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
