import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { PensjonsperiodeSpørsmålId } from './spørsmål';
import { IUsePensjonSkjemaParams, usePensjonSkjema } from './usePensjonSkjema';

interface Props extends ReturnType<typeof useModal>, IUsePensjonSkjemaParams {
    onLeggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtland: boolean;
}

export const PensjonModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilPensjonsperiode,
    gjelderUtland,
    personType,
    barn,
    erDød,
}) => {
    const { tekster } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        usePensjonSkjema({
            gjelderUtland,
            personType,
            barn,
            erDød,
        });

    const teksterForModal: IPensjonsperiodeTekstinnhold =
        tekster().FELLES.modaler.pensjonsperiode[personType];

    const { mottarPensjonNå, pensjonTilDato, pensjonFraDato, pensjonsland } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }

        onLeggTilPensjonsperiode({
            mottarPensjonNå: {
                id: PensjonsperiodeSpørsmålId.mottarPensjonNå,
                svar: mottarPensjonNå.erSynlig ? mottarPensjonNå.verdi : null,
            },
            pensjonsland: {
                id: PensjonsperiodeSpørsmålId.pensjonsland,
                svar: pensjonsland.erSynlig ? pensjonsland.verdi : '',
            },
            pensjonFra: {
                id: PensjonsperiodeSpørsmålId.fraDatoPensjon,
                svar: pensjonFraDato.erSynlig ? pensjonFraDato.verdi : '',
            },
            pensjonTil: {
                id: PensjonsperiodeSpørsmålId.tilDatoPensjon,
                svar: pensjonTilDato.erSynlig ? pensjonTilDato.verdi : '',
            },
        });

        toggleModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        mottarPensjonNå.verdi === ESvar.NEI || (personType === PersonType.andreForelder && !!erDød);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForModal.tittel}
            flettefelter={{ gjelderUtland }}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForModal.leggTilKnapp} />}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {mottarPensjonNå.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={mottarPensjonNå}
                        spørsmålDokument={teksterForModal.faarPensjonNaa}
                        flettefelter={{ barnetsNavn: barn?.navn }}
                    />
                )}
                {pensjonsland.erSynlig && (
                    <LandDropdown
                        felt={pensjonsland}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={
                                    periodenErAvsluttet
                                        ? teksterForModal.pensjonLandFortid.sporsmal
                                        : teksterForModal.pensjonLandNaatid.sporsmal
                                }
                                flettefelter={{ barnetsNavn: barn?.navn }}
                            />
                        }
                        dynamisk
                        ekskluderNorge
                    />
                )}

                {pensjonFraDato.erSynlig && (
                    <Datovelger
                        felt={pensjonFraDato}
                        label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                        skjema={skjema}
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {pensjonTilDato.erSynlig && (
                    <Datovelger
                        felt={pensjonTilDato}
                        label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                        skjema={skjema}
                        avgrensMaxDato={dagensDato()}
                        tilhørendeFraOgMedFelt={pensjonFraDato}
                        dynamisk
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
