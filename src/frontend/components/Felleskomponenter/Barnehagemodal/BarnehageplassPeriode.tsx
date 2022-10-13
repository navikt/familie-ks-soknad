import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IBarnehageplassTekstinnhold } from '../../../typer/sanity/modaler/barnehageplass';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { BarnehageplassPeriodeModal } from './BarnehageplassPeriodeModal';
import { BarnehageplassPeriodeOppsummering } from './barnehageplassPeriodeOppsummering';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';

interface BarnehageplassPeriodeProps {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
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
    const { erÅpen: barnehageplassModalErÅpen, toggleModal: toggleBarnehageplassModal } =
        useModal();
    const { tekster } = useApp();
    const barnehageplassTekster: IBarnehageplassTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.barnehageplass;

    return (
        <>
            <Informasjonsbolk tittelId={'tittel'} />
            {registrerteBarnehageplassPerioder.verdi.map((periode, index) => (
                <BarnehageplassPeriodeOppsummering
                    key={`barnehageplass-periode-${index}`}
                    barnehageplassPeriode={periode}
                    fjernPeriodeCallback={fjernBarnehageplassPeriode}
                    nummer={index + 1}
                />
            ))}
            {registrerteBarnehageplassPerioder.verdi.length > 0 && (
                <Element>
                    <TekstBlock block={barnehageplassTekster.flerePerioder} />
                </Element>
            )}

            <LeggTilKnapp
                onClick={toggleBarnehageplassModal}
                id={BarnehageplassPeriodeSpørsmålId.barnehageplassPeriode}
                feilmelding={
                    registrerteBarnehageplassPerioder.erSynlig &&
                    registrerteBarnehageplassPerioder.feilmelding &&
                    skjema.visFeilmeldinger && (
                        <TekstBlock block={barnehageplassTekster.leggTilFeilmelding} />
                    )
                }
            >
                <TekstBlock block={barnehageplassTekster.leggTilKnapp} />
            </LeggTilKnapp>
            <BarnehageplassPeriodeModal
                erÅpen={barnehageplassModalErÅpen}
                toggleModal={toggleBarnehageplassModal}
                onLeggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                barn={barn}
            />
        </>
    );
};
