import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../../typer/personType';
import { IEøsForBarnFeltTyper, IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { KontantstøttePeriodeModal } from './KontantstøttePeriodeModal';
import { KontantstøttePeriodeOppsummering } from './KontantstøttePeriodeOppsummering';
import {
    kontantstøttePeriodeFlereSpørsmål,
    kontantstøtteSpørsmålSpråkId,
} from './kontantstøttePeriodeSpråkUtils';
import { KontantstøttePeriodeSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper | IEøsForBarnFeltTyper, string>;
    registrerteEøsKontantstøttePerioder: Felt<IEøsKontantstøttePeriode[]>;
    leggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    barn: IBarnMedISøknad;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
}

type KontantstøttePeriodeProps = Props & PeriodePersonTypeProps;

export const KontantstøttePeriode: React.FC<KontantstøttePeriodeProps> = ({
    skjema,
    registrerteEøsKontantstøttePerioder,
    leggTilKontantstøttePeriode,
    fjernKontantstøttePeriode,
    personType,
    erDød,
    barn,
    tilhørendeJaNeiSpmFelt,
}) => {
    const { erÅpen: kontantstøtteModalErÅpen, toggleModal: toggleKontantstøtteModal } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålTekstId={kontantstøtteSpørsmålSpråkId(personType, erDød)}
                inkluderVetIkke={personType !== PersonType.søker}
                språkValues={{
                    ...(personType !== PersonType.søker && {
                        barn: barn.navn,
                    }),
                }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <>
                    {registrerteEøsKontantstøttePerioder.verdi.map((periode, index) => (
                        <KontantstøttePeriodeOppsummering
                            key={`eøs-kontantstøtte-periode-${index}`}
                            kontantstøttePeriode={periode}
                            fjernPeriodeCallback={fjernKontantstøttePeriode}
                            nummer={index + 1}
                            barnetsNavn={barn.navn}
                            personType={personType}
                            erDød={personType === PersonType.andreForelder && erDød}
                        />
                    ))}

                    {registrerteEøsKontantstøttePerioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={kontantstøttePeriodeFlereSpørsmål(personType)}
                                values={{ barn: barn.navn }}
                            />
                        </Element>
                    )}

                    <LeggTilKnapp
                        onClick={toggleKontantstøtteModal}
                        språkTekst={'ombarnet.trygdandreperioder.knapp'}
                        id={KontantstøttePeriodeSpørsmålId.kontantstøttePeriodeEøs}
                        feilmelding={
                            registrerteEøsKontantstøttePerioder.erSynlig &&
                            registrerteEøsKontantstøttePerioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />
                            )
                        }
                    />
                    <KontantstøttePeriodeModal
                        erÅpen={kontantstøtteModalErÅpen}
                        toggleModal={toggleKontantstøtteModal}
                        onLeggTilKontantstøttePeriode={leggTilKontantstøttePeriode}
                        barn={barn}
                        personType={personType}
                        erDød={erDød}
                    />
                </>
            )}
        </>
    );
};
