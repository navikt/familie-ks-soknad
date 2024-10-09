import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IAndreUtbetalingerTekstinnhold } from '../../../typer/sanity/modaler/andreUtbetalinger';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import TekstBlock from '../TekstBlock';

import { UtbetalingerSpørsmålId } from './spørsmål';
import { IUseUtbetalingerSkjemaParams, useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps extends IUseUtbetalingerSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilUtbetalinger: (utbetalingsperiode: IUtbetalingsperiode) => void;
    forklaring?: string;
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilUtbetalinger,
    personType,
    barn,
    erDød,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(personType, barn, erDød);

    const teksterForPersonType: IAndreUtbetalingerTekstinnhold =
        tekster().FELLES.modaler.andreUtbetalinger[personType];

    const andreForelderErDød: boolean = personType === PersonType.andreForelder && !!erDød;
    const periodenErAvsluttet: boolean =
        skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI || andreForelderErDød;

    const {
        fårUtbetalingNå,
        utbetalingLand,
        utbetalingFraDato,
        utbetalingTilDato,
        utbetalingTilDatoUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtbetalinger({
            fårUtbetalingNå: {
                id: UtbetalingerSpørsmålId.fårUtbetalingNå,
                svar: fårUtbetalingNå.erSynlig ? fårUtbetalingNå.verdi : null,
            },
            utbetalingLand: {
                id: UtbetalingerSpørsmålId.utbetalingLand,
                svar: utbetalingLand.verdi,
            },
            utbetalingFraDato: {
                id: UtbetalingerSpørsmålId.utbetalingFraDato,
                svar: utbetalingFraDato.verdi,
            },
            utbetalingTilDato: {
                id: UtbetalingerSpørsmålId.utbetalingTilDato,
                svar: svarForSpørsmålMedUkjent(utbetalingTilDatoUkjent, utbetalingTilDato),
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            onSubmitCallback={onLeggTil}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
            tittel={teksterForPersonType.tittel}
            forklaring={forklaring}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
        >
            <JaNeiSpm
                skjema={skjema}
                felt={fårUtbetalingNå}
                spørsmålDokument={teksterForPersonType.faarUtbetalingerNaa}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {(fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød) && (
                <>
                    <LandDropdown
                        felt={utbetalingLand}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={
                                    periodenErAvsluttet
                                        ? teksterForPersonType.utbetalingLandFortid.sporsmal
                                        : teksterForPersonType.utbetalingLandNaatid.sporsmal
                                }
                                flettefelter={{ barnetsNavn: barn?.navn }}
                            />
                        }
                        dynamisk
                    />
                    <Datovelger
                        skjema={skjema}
                        felt={utbetalingFraDato}
                        label={<TekstBlock block={teksterForPersonType.startdato.sporsmal} />}
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    />
                    <div>
                        <Datovelger
                            skjema={skjema}
                            felt={utbetalingTilDato}
                            label={
                                <TekstBlock
                                    block={
                                        periodenErAvsluttet
                                            ? teksterForPersonType.sluttdatoFortid.sporsmal
                                            : teksterForPersonType.sluttdatoFremtid.sporsmal
                                    }
                                />
                            }
                            avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                            avgrensMinDato={minTilDatoForUtbetalingEllerArbeidsperiode(
                                periodenErAvsluttet,
                                utbetalingFraDato.verdi
                            )}
                            disabled={utbetalingTilDatoUkjent.verdi === ESvar.JA}
                        />
                        <SkjemaCheckbox
                            label={plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)}
                            felt={utbetalingTilDatoUkjent}
                        />
                    </div>
                </>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
