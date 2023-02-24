import React from 'react';

import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IEøsYtelseTekstinnhold } from '../../../typer/sanity/modaler/eøsYtelse';
import { dagenEtterDato, dagensDato, gårsdagensDato, stringTilDate } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import AlertStripe from '../AlertStripe/AlertStripe';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { KontantstøttePeriodeSpørsmålId } from './spørsmål';
import {
    IUsePensjonsperiodeSkjemaParams,
    useKontantstøttePeriodeSkjema,
} from './useKontantstøttePeriodeSkjema';

interface Props extends ReturnType<typeof useModal>, IUsePensjonsperiodeSkjemaParams {
    onLeggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    barn: IBarnMedISøknad;
}
const StyledAlertStripe = styled(AlertStripe)`
    margin: 1rem 0 1rem 0;
`;

export const KontantstøttePeriodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilKontantstøttePeriode,
    barn,
    personType,
    erDød = false,
}) => {
    const { tekster } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useKontantstøttePeriodeSkjema(personType, erDød);

    const teksterForPersonType: IEøsYtelseTekstinnhold =
        tekster().FELLES.modaler.eøsYtelse[personType];

    const {
        mottarEøsKontantstøtteNå,
        kontantstøtteLand,
        fraDatoKontantstøttePeriode,
        tilDatoKontantstøttePeriode,
        månedligBeløp,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilKontantstøttePeriode({
            mottarEøsKontantstøtteNå: {
                id: KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå,
                svar: mottarEøsKontantstøtteNå.verdi,
            },
            kontantstøtteLand: {
                id: KontantstøttePeriodeSpørsmålId.kontantstøtteLand,
                svar: kontantstøtteLand.verdi,
            },
            fraDatoKontantstøttePeriode: {
                id: KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode,
                svar: fraDatoKontantstøttePeriode.verdi,
            },
            tilDatoKontantstøttePeriode: {
                id: KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode,
                svar: tilDatoKontantstøttePeriode.erSynlig ? tilDatoKontantstøttePeriode.verdi : '',
            },
            månedligBeløp: {
                id: KontantstøttePeriodeSpørsmålId.månedligBeløp,
                svar: trimWhiteSpace(månedligBeløp.verdi),
            },
        });

        toggleModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        mottarEøsKontantstøtteNå.verdi === ESvar.NEI ||
        (personType === PersonType.andreForelder && erDød);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForPersonType.tittel}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarEøsKontantstøtteNå}
                    spørsmålDokument={teksterForPersonType.faarYtelserNaa}
                    flettefelter={{ barnetsNavn: barn.navn }}
                />

                {kontantstøtteLand.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.kontantstøtteLand}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={
                                    periodenErAvsluttet
                                        ? teksterForPersonType.ytelseLandFortid.sporsmal
                                        : teksterForPersonType.ytelseLandNaatid.sporsmal
                                }
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                        kunEøs={true}
                        dynamisk
                        ekskluderNorge
                    />
                )}
                {fraDatoKontantstøttePeriode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoKontantstøttePeriode}
                        skjema={skjema}
                        label={<TekstBlock block={teksterForPersonType.startdato.sporsmal} />}
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {tilDatoKontantstøttePeriode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.tilDatoKontantstøttePeriode}
                        skjema={skjema}
                        label={<TekstBlock block={teksterForPersonType.sluttdato.sporsmal} />}
                        avgrensMinDato={
                            skjema.felter.fraDatoKontantstøttePeriode.verdi
                                ? dagenEtterDato(
                                      stringTilDate(skjema.felter.fraDatoKontantstøttePeriode.verdi)
                                  )
                                : undefined
                        }
                        avgrensMaxDato={dagensDato()}
                    />
                )}
                {månedligBeløp.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.månedligBeløp}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={
                            <TekstBlock
                                block={teksterForPersonType.beloepPerMaaned.sporsmal}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                        }
                        tilleggsinfo={
                            <StyledAlertStripe variant={'info'}>
                                <TekstBlock block={teksterForPersonType.beloepPerMaaned.alert} />
                            </StyledAlertStripe>
                        }
                        bredde={'S'}
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
