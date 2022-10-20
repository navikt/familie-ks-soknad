import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetUtvidetFeltTyper,
} from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { ArbeidsperiodeModal } from './ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from './ArbeidsperiodeOppsummering';
import { arbeidsperiodeSpørsmålDokument } from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

interface ArbeidsperiodeProps {
    skjema: ISkjema<
        | IDinLivssituasjonFeltTyper
        | IOmBarnetUtvidetFeltTyper
        | IEøsForSøkerFeltTyper
        | IEøsForBarnFeltTyper,
        string
    >;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
}

type Props = ArbeidsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Arbeidsperiode: React.FC<Props> = ({
    skjema,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    gjelderUtlandet = false,
    arbeiderEllerArbeidetFelt,
    registrerteArbeidsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { tekster } = useApp();
    const { erÅpen: arbeidsmodalErÅpen, toggleModal: toggleArbeidsmodal } = useModal();
    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.arbeidsperiode[personType];
    const { flerePerioder, leggTilKnapp } = teksterForModal;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålDokument={arbeidsperiodeSpørsmålDokument(
                    gjelderUtlandet,
                    personType,
                    tekster,
                    erDød
                )}
                inkluderVetIkke={personType !== PersonType.søker}
                barnetsNavn={barn?.navn}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <>
                    {registrerteArbeidsperioder.verdi.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            arbeidsperiode={periode}
                            fjernPeriodeCallback={fjernArbeidsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={personType === PersonType.andreForelder && erDød}
                        />
                    ))}
                    {registrerteArbeidsperioder.verdi.length > 0 && (
                        <TekstBlock
                            block={flerePerioder}
                            typografi={Typografi.Label}
                            flettefelter={{
                                gjelderUtland: gjelderUtlandet,
                                barnetsNavn: barn?.navn,
                            }}
                        />
                    )}
                    <LeggTilKnapp
                        onClick={toggleArbeidsmodal}
                        id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                        feilmelding={
                            registrerteArbeidsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteArbeidsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={leggTilKnapp} />
                    </LeggTilKnapp>
                    <ArbeidsperiodeModal
                        erÅpen={arbeidsmodalErÅpen}
                        toggleModal={toggleArbeidsmodal}
                        onLeggTilArbeidsperiode={leggTilArbeidsperiode}
                        gjelderUtlandet={gjelderUtlandet}
                        personType={personType}
                        erDød={erDød}
                    />
                </>
            )}
        </>
    );
};
