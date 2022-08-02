import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    mottarEllerMottattUtbetalingSpråkId,
    utbetalingerFlerePerioderSpmSpråkId,
} from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';
import { UtbetalingerModal } from './UtbetalingerModal';
import { UtbetalingsperiodeOppsummering } from './UtbetalingsperiodeOppsummering';

interface UtbetalingsperiodeProps {
    skjema: ISkjema<IEøsForBarnFeltTyper | IEøsForSøkerFeltTyper, string>;
    leggTilUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    fjernUtbetalingsperiode: (periode: IUtbetalingsperiode) => void;
    gjelderUtlandet?: boolean;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
    registrerteUtbetalingsperioder: Felt<IUtbetalingsperiode[]>;
}

type Props = UtbetalingsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Utbetalingsperiode: React.FC<Props> = ({
    skjema,
    leggTilUtbetalingsperiode,
    fjernUtbetalingsperiode,
    tilhørendeJaNeiSpmFelt,
    registrerteUtbetalingsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { erÅpen: utbetalingermodalErÅpen, toggleModal: toggleUtbetalingsmodal } = useModal();

    const barnetsNavn = barn && barn.navn;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålTekstId={mottarEllerMottattUtbetalingSpråkId(personType, erDød)}
                inkluderVetIkke={personType !== PersonType.Søker}
                språkValues={{
                    ...(barn && {
                        navn: barnetsNavn,
                        barn: barnetsNavn,
                    }),
                }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <>
                    {registrerteUtbetalingsperioder.verdi.map((utbetalingsperiode, index) => (
                        <UtbetalingsperiodeOppsummering
                            key={`utbetalingsperiode-${index}`}
                            utbetalingsperiode={utbetalingsperiode}
                            fjernPeriodeCallback={fjernUtbetalingsperiode}
                            nummer={index + 1}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                            barn={barn}
                        />
                    ))}
                    {registrerteUtbetalingsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={utbetalingerFlerePerioderSpmSpråkId(personType)}
                                values={{
                                    ...(barn && { barn: barnetsNavn }),
                                }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        onClick={toggleUtbetalingsmodal}
                        språkTekst={'felles.flereytelser.knapp'}
                        id={UtbetalingerSpørsmålId.utbetalingsperioder}
                        feilmelding={
                            skjema.visFeilmeldinger && registrerteUtbetalingsperioder.feilmelding
                        }
                    />
                    <UtbetalingerModal
                        erÅpen={utbetalingermodalErÅpen}
                        toggleModal={toggleUtbetalingsmodal}
                        onLeggTilUtbetalinger={leggTilUtbetalingsperiode}
                        personType={personType}
                        barn={barn}
                        erDød={erDød}
                    />
                </>
            )}
        </>
    );
};
