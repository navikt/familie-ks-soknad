import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IBarnehageplassPeriode } from '../../../typer/perioder';
import { PeriodePersonTypeProps } from '../../../typer/personType';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnehageplassPeriodeModal } from './BarnehageplassPeriodeModal';
import { BarnehageplassPeriodeOppsummering } from './barnehageplassPeriodeOppsummering';
import { BarnehageplassPeriodeSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    registrerteBarnehageplassPerioder: Felt<IBarnehageplassPeriode[]>;
    leggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    fjernBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    barn: IBarnMedISøknad;
}

type BarnehageplassPeriodeProps = Props & PeriodePersonTypeProps;

export const BarnehageplassPeriode: React.FC<BarnehageplassPeriodeProps> = ({
    skjema,
    registrerteBarnehageplassPerioder,
    leggTilBarnehageplassPeriode,
    fjernBarnehageplassPeriode,
    personType,
    erDød,
    barn,
}) => {
    const { erÅpen: barnehageplassModalErÅpen, toggleModal: toggleBarnehageplassModal } =
        useModal();

    return (
        <>
            <Informasjonsbolk tittelId={'todo.ombarnet.barnehageplass.oppfølging'} />
            {registrerteBarnehageplassPerioder.verdi.map((periode, index) => (
                <BarnehageplassPeriodeOppsummering
                    key={`eøs-kontantstøtte-periode-${index}`}
                    barnehageplassPeriode={periode}
                    fjernPeriodeCallback={fjernBarnehageplassPeriode}
                    nummer={index + 1}
                    barnetsNavn={barn.navn}
                    personType={personType}
                    erDød={false}
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
                personType={personType}
                erDød={erDød}
            />
        </>
    );
};
