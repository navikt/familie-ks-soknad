import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { arbeidsperiodeModalSpørsmålSpråkId } from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface ArbeidsperiodeModalProps
    extends ReturnType<typeof useModal>,
        IUseArbeidsperiodeSkjemaParams {
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
}

export const ArbeidsperiodeModal: React.FC<ArbeidsperiodeModalProps> = ({
    erÅpen,
    toggleModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    personType,
    erDød = false,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, personType, erDød);

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        tilDatoArbeidsperiodeUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilArbeidsperiode({
            arbeidsperiodeAvsluttet: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
                svar: arbeidsperiodeAvsluttet.erSynlig
                    ? (arbeidsperiodeAvsluttet.verdi as ESvar)
                    : null,
            },
            arbeidsperiodeland: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                svar: arbeidsperiodeLand.erSynlig ? arbeidsperiodeLand.verdi : '',
            },
            arbeidsgiver: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsgiver,
                svar: arbeidsgiver.erSynlig ? trimWhiteSpace(arbeidsgiver.verdi) : '',
            },
            fraDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode,
                svar: fraDatoArbeidsperiode.erSynlig ? fraDatoArbeidsperiode.verdi : '',
            },
            tilDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
                svar: tilDatoArbeidsperiode.erSynlig
                    ? svarForSpørsmålMedUkjent(tilDatoArbeidsperiodeUkjent, tilDatoArbeidsperiode)
                    : '',
            },
        });

        toggleModal();
        nullstillSkjema();
    };

    const modalTittel = gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet.verdi === ESvar.JA ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = arbeidsperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilarbeidsperiode.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {arbeidsperiodeAvsluttet.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.arbeidsperiodeAvsluttet}
                        spørsmålTekstId={hentSpørsmålTekstId(
                            ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                        )}
                    />
                )}
                {arbeidsperiodeLand.erSynlig && (
                    <KomponentGruppe inline>
                        <LandDropdown
                            felt={skjema.felter.arbeidsperiodeLand}
                            skjema={skjema}
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand
                                    )}
                                />
                            }
                            dynamisk
                            ekskluderNorge
                        />
                    </KomponentGruppe>
                )}
                {arbeidsgiver.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.arbeidsgiver}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={hentSpørsmålTekstId(
                            ArbeidsperiodeSpørsmålsId.arbeidsgiver
                        )}
                    />
                )}
                {fraDatoArbeidsperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoArbeidsperiode}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={hentSpørsmålTekstId(
                                    ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode
                                )}
                            />
                        }
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {tilDatoArbeidsperiode.erSynlig && (
                    <>
                        <Datovelger
                            felt={skjema.felter.tilDatoArbeidsperiode}
                            skjema={skjema}
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode
                                    )}
                                />
                            }
                            avgrensMinDato={minTilDatoForUtbetalingEllerArbeidsperiode(
                                periodenErAvsluttet,
                                skjema.felter.fraDatoArbeidsperiode.verdi
                            )}
                            avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                            disabled={skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA}
                            calendarPosition={'fullscreen'}
                        />

                        <SkjemaCheckbox
                            felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                            labelSpråkTekstId={hentSpørsmålTekstId(
                                ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                            )}
                        />
                    </>
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
