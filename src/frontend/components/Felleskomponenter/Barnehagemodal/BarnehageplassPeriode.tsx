import React from 'react';

import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { Typografi } from '../../../typer/common';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import { IOmBarnetTekstinnhold } from '../../SøknadsSteg/OmBarnet/innholdTyper';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

import { BarnehageplassPeriodeModal } from './BarnehageplassPeriodeModal';
import { BarnehageplassPeriodeOppsummering } from './BarnehageplassPeriodeOppsummering';

interface BarnehageplassPeriodeProps {
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    registrerteBarnehageplassPerioder: Felt<IBarnehageplassPeriode[]>;
    leggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    fjernBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    barn: IBarnMedISøknad;
}

export const BarnehageplassPeriode: React.FC<BarnehageplassPeriodeProps> = ({
    skjema,
    registrerteBarnehageplassPerioder,
    leggTilBarnehageplassPeriode,
    fjernBarnehageplassPeriode,
    barn,
}) => {
    const {
        erÅpen: barnehageplassModalErÅpen,
        lukkModal: lukkBarnehageplassModal,
        åpneModal: åpneBarnehageplassModal,
    } = useModal();
    const { tekster, plainTekst } = useAppContext();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;
    const teksterForOmBarnetSteg: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];
    const barnetsNavn = barn.navn;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <PerioderContainer
            tittel={uppercaseFørsteBokstav(
                plainTekst(frittståendeOrdTekster.barnehageplassperioder)
            )}
        >
            <TekstBlock
                block={teksterForOmBarnetSteg.opplystBarnehageplass}
                flettefelter={{ barnetsNavn }}
                typografi={Typografi.Label}
            />

            {registrerteBarnehageplassPerioder.verdi.map((periode, index) => (
                <BarnehageplassPeriodeOppsummering
                    key={`barnehageplass-periode-${index}`}
                    barnehageplassPeriode={periode}
                    fjernPeriodeCallback={fjernBarnehageplassPeriode}
                    nummer={index + 1}
                />
            ))}

            <LeggTilKnapp
                onClick={åpneBarnehageplassModal}
                id={registrerteBarnehageplassPerioder.id}
                leggTilFlereTekst={
                    registrerteBarnehageplassPerioder.verdi.length > 0 &&
                    plainTekst(barnehageplassTekster.flerePerioder)
                }
                feilmelding={
                    registrerteBarnehageplassPerioder.erSynlig &&
                    skjema.visFeilmeldinger &&
                    registrerteBarnehageplassPerioder.feilmelding
                }
            >
                <TekstBlock block={barnehageplassTekster.leggTilKnapp} />
            </LeggTilKnapp>
            {barnehageplassModalErÅpen && (
                <BarnehageplassPeriodeModal
                    erÅpen={barnehageplassModalErÅpen}
                    lukkModal={lukkBarnehageplassModal}
                    onLeggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                    barn={barn}
                    forklaring={plainTekst(barnehageplassTekster.leggTilPeriodeForklaring)}
                />
            )}
        </PerioderContainer>
    );
};
