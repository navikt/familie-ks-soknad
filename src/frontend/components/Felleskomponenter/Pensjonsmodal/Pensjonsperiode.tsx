import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
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
import PerioderContainer from '../PerioderContainer';
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
    const { tekster, plainTekst } = useApp();
    const teksterForModal = tekster().FELLES.modaler.pensjonsperiode[personType];

    const {
        erÅpen: pensjonsmodalErÅpen,
        lukkModal: lukkPensjonsmodal,
        åpneModal: åpnePensjonsmodal,
    } = useModal();
    const { toggles } = useFeatureToggles();

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
                <PerioderContainer>
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
                    <LeggTilKnapp
                        onClick={åpnePensjonsmodal}
                        id={registrertePensjonsperioder.id}
                        forklaring={
                            registrertePensjonsperioder.verdi.length > 0 ? (
                                <TekstBlock
                                    block={teksterForModal.flerePerioder}
                                    flettefelter={{
                                        barnetsNavn: barn?.navn,
                                        gjelderUtland: gjelderUtlandet,
                                    }}
                                />
                            ) : toggles.FORKLARENDE_TEKSTER_OVER_LEGG_TIL_KNAPP &&
                              teksterForModal.leggTilPeriodeForklaring ? (
                                plainTekst(teksterForModal.leggTilPeriodeForklaring)
                            ) : undefined
                        }
                        feilmelding={
                            registrertePensjonsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrertePensjonsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForModal.leggTilKnapp} />
                    </LeggTilKnapp>
                    {pensjonsmodalErÅpen && (
                        <PensjonModal
                            erÅpen={pensjonsmodalErÅpen}
                            lukkModal={lukkPensjonsmodal}
                            onLeggTilPensjonsperiode={leggTilPensjonsperiode}
                            gjelderUtland={gjelderUtlandet}
                            personType={personType}
                            erDød={erDød}
                            barn={barn}
                            forklaring={plainTekst(teksterForModal.leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </>
    );
};
