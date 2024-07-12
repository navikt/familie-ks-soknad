import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IEøsForBarnFeltTyper, IEøsForSøkerFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';

import { mottarEllerMottattUtbetalingApiNavn } from './språkUtils';
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
    const { tekster, plainTekst } = useApp();
    const {
        erÅpen: utbetalingermodalErÅpen,
        lukkModal: lukkUtbetalingsmodal,
        åpneModal: åpneUtbetalingsmodal,
    } = useModal();
    const { toggles } = useFeatureToggles();

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
                <PerioderContainer>
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
                    <LeggTilKnapp
                        onClick={åpneUtbetalingsmodal}
                        id={registrerteUtbetalingsperioder.id}
                        forklaring={
                            registrerteUtbetalingsperioder.verdi.length > 0
                                ? plainTekst(teksterForPersontype.flerePerioder, {
                                      barnetsNavn: barn?.navn,
                                  })
                                : toggles.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP &&
                                    teksterForPersontype.leggTilPeriodeForklaring
                                  ? plainTekst(teksterForPersontype.leggTilPeriodeForklaring)
                                  : undefined
                        }
                        feilmelding={
                            registrerteUtbetalingsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteUtbetalingsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForPersontype.leggTilKnapp} />
                    </LeggTilKnapp>

                    {utbetalingermodalErÅpen && (
                        <UtbetalingerModal
                            erÅpen={utbetalingermodalErÅpen}
                            lukkModal={lukkUtbetalingsmodal}
                            onLeggTilUtbetalinger={leggTilUtbetalingsperiode}
                            personType={personType}
                            barn={barn}
                            erDød={erDød}
                            forklaring={plainTekst(teksterForPersontype.leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </>
    );
};
