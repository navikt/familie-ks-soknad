import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
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

    return (
        <>
            <Informasjonsbolk tittelId={'todo.ombarnet.barnehageplass.oppfølging'} />
            {registrerteBarnehageplassPerioder.verdi.map((periode, index) => (
                <BarnehageplassPeriodeOppsummering
                    key={`barnehageplass-periode-${index}`}
                    barnehageplassPeriode={periode}
                    fjernPeriodeCallback={fjernBarnehageplassPeriode}
                    nummer={index + 1}
                    barnetsNavn={barn.navn}
                />
            ))}
            {registrerteBarnehageplassPerioder.verdi.length > 0 && (
                <Element>
                    <SpråkTekst
                        id={'todo.ombarnet.barnehageplass.periode'}
                        values={{ barn: barn.navn }}
                    />
                </Element>
            )}

            <LeggTilKnapp
                onClick={toggleBarnehageplassModal}
                språkTekst={'todo.ombarnet.barnehageplass.periode'}
                id={BarnehageplassPeriodeSpørsmålId.barnehageplassPeriode}
                feilmelding={
                    registrerteBarnehageplassPerioder.erSynlig &&
                    registrerteBarnehageplassPerioder.feilmelding &&
                    skjema.visFeilmeldinger && (
                        <SpråkTekst id={'todo.ombarnet.barnehageplass.periode'} />
                    )
                }
            />
            <BarnehageplassPeriodeModal
                erÅpen={barnehageplassModalErÅpen}
                toggleModal={toggleBarnehageplassModal}
                onLeggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                barn={barn}
            />
        </>
    );
};
