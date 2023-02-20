import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
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
import TekstBlock from '../TekstBlock';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface ArbeidsperiodeModalProps
    extends ReturnType<typeof useModal>,
        IUseArbeidsperiodeSkjemaParams {
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
    barn?: IBarnMedISøknad;
}

export const ArbeidsperiodeModal: React.FC<ArbeidsperiodeModalProps> = ({
    erÅpen,
    toggleModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    personType,
    erDød = false,
    barn,
}) => {
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

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet.verdi === ESvar.JA ||
        (personType === PersonType.andreForelder && erDød);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForModal.tittel}
            flettefelter={{ gjelderUtland: gjelderUtlandet }}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForModal.leggTilKnapp} />}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {arbeidsperiodeAvsluttet.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.arbeidsperiodeAvsluttet}
                        spørsmålDokument={teksterForModal.arbeidsperiodenAvsluttet}
                    />
                )}
                {arbeidsperiodeLand.erSynlig && (
                    <KomponentGruppe inline>
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
                    </KomponentGruppe>
                )}
                {arbeidsgiver.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.arbeidsgiver}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={<TekstBlock block={teksterForModal.arbeidsgiver.sporsmal} />}
                    />
                )}
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
                                new Date(skjema.felter.fraDatoArbeidsperiode.verdi)
                            )}
                            avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                            disabled={skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA}
                        />

                        <SkjemaCheckbox
                            felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                            label={plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel)}
                        />
                    </>
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
