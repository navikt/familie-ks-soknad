import React from 'react';

import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';

import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
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
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { kontantstøttePeriodeModalSpørsmålSpråkId } from './kontantstøttePeriodeSpråkUtils';
import { KontantstøttePeriodeSpørsmålId } from './spørsmål';
import {
    IUsePensjonsperiodeSkjemaParams,
    useKontantstøttePeriodeSkjema,
} from './useKontantstøttePeriodeSkjema';

interface Props extends ReturnType<typeof useModal>, IUsePensjonsperiodeSkjemaParams {
    onLeggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
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
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useKontantstøttePeriodeSkjema(personType, barn, erDød);

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

    const hentSpørsmålTekstId = kontantstøttePeriodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const spørsmålSpråkTekst = (spørsmålId: KontantstøttePeriodeSpørsmålId) => (
        <SpråkTekst id={hentSpørsmålTekstId(spørsmålId)} values={{ barn: barn.navn }} />
    );

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'modal.trygdandreperioder.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'modal.trygdandreperioder.tittel'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarEøsKontantstøtteNå}
                    spørsmålTekstId={hentSpørsmålTekstId(
                        KontantstøttePeriodeSpørsmålId.mottarEøsKontantstøtteNå
                    )}
                    språkValues={{ barn: barn.navn }}
                />

                {kontantstøtteLand.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.kontantstøtteLand}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(KontantstøttePeriodeSpørsmålId.kontantstøtteLand)}
                        kunEøs={true}
                        dynamisk
                        ekskluderNorge
                    />
                )}
                {fraDatoKontantstøttePeriode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoKontantstøttePeriode}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(
                            KontantstøttePeriodeSpørsmålId.fraDatoKontantstøttePeriode
                        )}
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {tilDatoKontantstøttePeriode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.tilDatoKontantstøttePeriode}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(
                            KontantstøttePeriodeSpørsmålId.tilDatoKontantstøttePeriode
                        )}
                        avgrensMinDato={skjema.felter.fraDatoKontantstøttePeriode.verdi}
                        avgrensMaxDato={dagensDato()}
                        calendarPosition={'fullscreen'}
                    />
                )}
                {månedligBeløp.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.månedligBeløp}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={hentSpørsmålTekstId(
                            KontantstøttePeriodeSpørsmålId.månedligBeløp
                        )}
                        språkValues={{
                            ...(barn && {
                                barn: barn.navn,
                            }),
                        }}
                        tilleggsinfo={
                            <StyledAlertStripe variant={'info'}>
                                <SpråkTekst id={'ombarnet.trygdbeløp.info'} />
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
