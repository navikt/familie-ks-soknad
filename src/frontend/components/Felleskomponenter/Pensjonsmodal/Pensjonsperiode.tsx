import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { PensjonModal } from './Pensjonsmodal';
import { PensjonsperiodeOppsummering } from './PensjonsperiodeOppsummering';
import { pensjonSpørsmålDokument } from './språkUtils';

interface PensjonsperiodeProps {
    skjema: ISkjema<
        | IDinLivssituasjonFeltTyper
        | IOmBarnetFeltTyper
        | IEøsForSøkerFeltTyper
        | IEøsForBarnFeltTyper,
        string
    >;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtlandet: boolean;
    mottarEllerMottattPensjonFelt: Felt<ESvar | null>;
    registrertePensjonsperioder: Felt<IPensjonsperiode[]>;
}

type Props = PensjonsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Pensjonsperiode: React.FC<Props> = ({
    skjema,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
    gjelderUtlandet,
    mottarEllerMottattPensjonFelt,
    registrertePensjonsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { tekster } = useApp();
    const teksterForModal = tekster().FELLES.modaler.pensjonsperiode[personType];

    const { erÅpen: pensjonsmodalErÅpen, toggleModal: togglePensjonsmodal } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={mottarEllerMottattPensjonFelt}
                spørsmålDokument={pensjonSpørsmålDokument(
                    gjelderUtlandet,
                    personType,
                    tekster,
                    erDød
                )}
                inkluderVetIkke={personType !== PersonType.søker}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {mottarEllerMottattPensjonFelt.verdi === ESvar.JA && (
                <>
                    {registrertePensjonsperioder.verdi.map((pensjonsperiode, index) => (
                        <PensjonsperiodeOppsummering
                            key={`pensjonsperiode-${index}`}
                            pensjonsperiode={pensjonsperiode}
                            fjernPeriodeCallback={fjernPensjonsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={personType === PersonType.andreForelder && erDød}
                            barn={personType !== PersonType.søker ? barn : undefined}
                        />
                    ))}
                    {registrertePensjonsperioder.verdi.length > 0 && (
                        <TekstBlock
                            block={teksterForModal.flerePerioder}
                            typografi={Typografi.Label}
                            flettefelter={{
                                barnetsNavn: barn?.navn,
                                gjelderUtland: gjelderUtlandet,
                            }}
                        />
                    )}
                    <LeggTilKnapp
                        onClick={togglePensjonsmodal}
                        id={registrertePensjonsperioder.id}
                        feilmelding={
                            registrertePensjonsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrertePensjonsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForModal.leggTilKnapp} />
                    </LeggTilKnapp>
                    <PensjonModal
                        erÅpen={pensjonsmodalErÅpen}
                        toggleModal={togglePensjonsmodal}
                        onLeggTilPensjonsperiode={leggTilPensjonsperiode}
                        gjelderUtland={gjelderUtlandet}
                        personType={personType}
                        erDød={erDød}
                        barn={barn}
                    />
                </>
            )}
        </>
    );
};
