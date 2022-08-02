import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../../typer/personType';
import { IEøsForBarnFeltTyper, IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnetrygdperiodeModal } from './BarnetrygdperiodeModal';
import { BarnetrygdsperiodeOppsummering } from './BarnetrygdperiodeOppsummering';
import {
    barnetrygdperiodeFlereSpørsmål,
    barnetrygdSpørsmålSpråkId,
} from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper | IEøsForBarnFeltTyper, string>;
    registrerteEøsBarnetrygdsperioder: Felt<IEøsBarnetrygdsperiode[]>;
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    barn: IBarnMedISøknad;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
}

type BarnetrygdperiodeProps = Props & PeriodePersonTypeProps;

export const Barnetrygdperiode: React.FC<BarnetrygdperiodeProps> = ({
    skjema,
    registrerteEøsBarnetrygdsperioder,
    leggTilBarnetrygdsperiode,
    fjernBarnetrygdsperiode,
    personType,
    erDød,
    barn,
    tilhørendeJaNeiSpmFelt,
}) => {
    const { erÅpen: barnetrygdsmodalErÅpen, toggleModal: toggleBarnetrygdsmodal } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålTekstId={barnetrygdSpørsmålSpråkId(personType, erDød)}
                inkluderVetIkke={personType !== PersonType.Søker}
                språkValues={{
                    ...(personType !== PersonType.Søker && {
                        barn: barn.navn,
                    }),
                }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <>
                    {registrerteEøsBarnetrygdsperioder.verdi.map((periode, index) => (
                        <BarnetrygdsperiodeOppsummering
                            key={`eøs-barnetrygdsperiode-${index}`}
                            barnetrygdsperiode={periode}
                            fjernPeriodeCallback={fjernBarnetrygdsperiode}
                            nummer={index + 1}
                            barnetsNavn={barn.navn}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                        />
                    ))}

                    {registrerteEøsBarnetrygdsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={barnetrygdperiodeFlereSpørsmål(personType)}
                                values={{ barn: barn.navn }}
                            />
                        </Element>
                    )}

                    <LeggTilKnapp
                        onClick={toggleBarnetrygdsmodal}
                        språkTekst={'ombarnet.trygdandreperioder.knapp'}
                        id={BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs}
                        feilmelding={
                            registrerteEøsBarnetrygdsperioder.erSynlig &&
                            registrerteEøsBarnetrygdsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />
                            )
                        }
                    />
                    <BarnetrygdperiodeModal
                        erÅpen={barnetrygdsmodalErÅpen}
                        toggleModal={toggleBarnetrygdsmodal}
                        onLeggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                        barn={barn}
                        personType={personType}
                        erDød={erDød}
                    />
                </>
            )}
        </>
    );
};
