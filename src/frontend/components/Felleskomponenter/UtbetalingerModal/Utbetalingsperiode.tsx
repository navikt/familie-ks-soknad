import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { mottarEllerMottattUtbetalingApiNavn } from './språkUtils';
import { UtbetalingerModal } from './UtbetalingerModal';
import { UtbetalingsperiodeOppsummering } from './UtbetalingsperiodeOppsummering';
import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

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
    const { tekster } = useApp();
    const { erÅpen: utbetalingermodalErÅpen, toggleModal: toggleUtbetalingsmodal } = useModal();

    const teksterForPersontype = tekster().FELLES.modaler.andreUtbetalinger[personType];

    const barnetsNavn = barn && barn.navn;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                inkluderVetIkke={personType !== PersonType.søker}
                spørsmålDokument={mottarEllerMottattUtbetalingApiNavn(personType, tekster(), erDød)}
                flettefelter={{ barnetsNavn: barnetsNavn }}
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
                            erDød={personType === PersonType.andreForelder && erDød}
                            barn={barn}
                        />
                    ))}
                    {registrerteUtbetalingsperioder.verdi.length > 0 && (
                        <TekstBlock
                            block={teksterForPersontype.flerePerioder}
                            typografi={Typografi.Label}
                            flettefelter={{
                                barnetsNavn: barn?.navn,
                            }}
                        />
                    )}
                    <LeggTilKnapp
                        onClick={toggleUtbetalingsmodal}
                        id={registrerteUtbetalingsperioder.id}
                        feilmelding={
                            registrerteUtbetalingsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteUtbetalingsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForPersontype.leggTilKnapp} />
                    </LeggTilKnapp>

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
