import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { dagensDato, gårsdagensDato, sisteDagDenneMåneden } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import TekstBlock from '../TekstBlock';

import { ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface ArbeidsperiodeModalProps extends IUseArbeidsperiodeSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
    barn?: IBarnMedISøknad;
    forklaring?: string;
}

export const ArbeidsperiodeModal: React.FC<ArbeidsperiodeModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    personType,
    erDød = false,
    barn,
    forklaring = undefined,
}) => {
    const { toggles } = useFeatureToggles();
    const { tekster, plainTekst } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, personType, erDød);

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        tilDatoArbeidsperiodeUkjent,
        adresse,
        adresseUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilArbeidsperiode({
            arbeidsperiodeAvsluttet: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
                svar: arbeidsperiodeAvsluttet.verdi,
            },
            arbeidsperiodeland: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                svar: arbeidsperiodeLand.verdi,
            },
            arbeidsgiver: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsgiver,
                svar: trimWhiteSpace(arbeidsgiver.verdi),
            },
            fraDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode,
                svar: fraDatoArbeidsperiode.verdi,
            },
            tilDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
                svar: svarForSpørsmålMedUkjent(tilDatoArbeidsperiodeUkjent, tilDatoArbeidsperiode),
            },
            adresse: {
                id: ArbeidsperiodeSpørsmålsId.adresse,
                svar: svarForSpørsmålMedUkjent(adresseUkjent, adresse),
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet.verdi === ESvar.JA ||
        (personType === PersonType.andreForelder && erDød);

    const adresseTekst = periodenErAvsluttet
        ? teksterForModal.adresseFortid
        : teksterForModal.adresseNaatid;

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForModal.tittel}
            forklaring={forklaring}
            flettefelter={{ gjelderUtland: gjelderUtlandet }}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForModal.leggTilKnapp} />}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            {arbeidsperiodeAvsluttet.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.arbeidsperiodeAvsluttet}
                    spørsmålDokument={teksterForModal.arbeidsperiodenAvsluttet}
                />
            )}
            {arbeidsperiodeLand.erSynlig && (
                <LandDropdown
                    felt={skjema.felter.arbeidsperiodeLand}
                    skjema={skjema}
                    label={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.hvilketLandFortid.sporsmal
                                    : teksterForModal.hvilketLandNaatid.sporsmal
                            }
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    dynamisk
                    ekskluderNorge
                />
            )}
            {arbeidsgiver.erSynlig && (
                <SkjemaFeltInput
                    felt={skjema.felter.arbeidsgiver}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={teksterForModal.arbeidsgiver.sporsmal} />}
                />
            )}

            {toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO] ? (
                <>
                    {fraDatoArbeidsperiode.erSynlig && (
                        <MånedÅrVelger
                            felt={skjema.felter.fraDatoArbeidsperiode}
                            label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                            senesteValgbareMåned={
                                periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                            }
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.FØRSTE_DAG}
                            kanIkkeVæreFremtid={true}
                        />
                    )}
                    {tilDatoArbeidsperiode.erSynlig && (
                        <>
                            <MånedÅrVelger
                                felt={skjema.felter.tilDatoArbeidsperiode}
                                label={
                                    <TekstBlock
                                        block={
                                            periodenErAvsluttet
                                                ? teksterForModal.sluttdatoFortid.sporsmal
                                                : teksterForModal.sluttdatoFremtid.sporsmal
                                        }
                                    />
                                }
                                tidligsteValgbareMåned={minTilDatoForUtbetalingEllerArbeidsperiode(
                                    periodenErAvsluttet,
                                    skjema.felter.fraDatoArbeidsperiode.verdi
                                )}
                                senesteValgbareMåned={
                                    periodenErAvsluttet ? sisteDagDenneMåneden() : undefined
                                }
                                dagIMåneden={DagIMåneden.SISTE_DAG}
                                kanIkkeVæreFremtid={periodenErAvsluttet}
                                kanIkkeVæreFortid={!periodenErAvsluttet}
                                disabled={
                                    skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA
                                }
                            />

                            <SkjemaCheckbox
                                felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                                label={plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel)}
                            />
                        </>
                    )}
                </>
            ) : (
                <>
                    {fraDatoArbeidsperiode.erSynlig && (
                        <Datovelger
                            felt={skjema.felter.fraDatoArbeidsperiode}
                            skjema={skjema}
                            label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                            avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                        />
                    )}
                    {tilDatoArbeidsperiode.erSynlig && (
                        <>
                            <Datovelger
                                felt={skjema.felter.tilDatoArbeidsperiode}
                                skjema={skjema}
                                label={
                                    <TekstBlock
                                        block={
                                            periodenErAvsluttet
                                                ? teksterForModal.sluttdatoFortid.sporsmal
                                                : teksterForModal.sluttdatoFremtid.sporsmal
                                        }
                                    />
                                }
                                avgrensMinDato={minTilDatoForUtbetalingEllerArbeidsperiode(
                                    periodenErAvsluttet,
                                    skjema.felter.fraDatoArbeidsperiode.verdi
                                )}
                                avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                                disabled={
                                    skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA
                                }
                            />

                            <SkjemaCheckbox
                                felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                                label={plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel)}
                            />
                        </>
                    )}
                </>
            )}
            <div>
                <SkjemaFeltInput
                    felt={skjema.felter.adresse}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={plainTekst(adresseTekst.sporsmal)}
                    disabled={skjema.felter.adresseUkjent.verdi === ESvar.JA}
                    description={plainTekst(adresseTekst.beskrivelse)}
                />
                <SkjemaCheckbox
                    felt={skjema.felter.adresseUkjent}
                    label={plainTekst(adresseTekst.checkboxLabel)}
                />
            </div>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
