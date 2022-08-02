import React from 'react';

import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';

import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
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
import { barnetrygdperiodeModalSpørsmålSpråkId } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';
import {
    IUsePensjonsperiodeSkjemaParams,
    useBarnetrygdperiodeSkjema,
} from './useBarnetrygdperiodeSkjema';

interface Props extends ReturnType<typeof useModal>, IUsePensjonsperiodeSkjemaParams {
    onLeggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
}
const StyledAlertStripe = styled(AlertStripe)`
    margin: 1rem 0 1rem 0;
`;

export const BarnetrygdperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilBarnetrygdsperiode,
    barn,
    personType,
    erDød = false,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnetrygdperiodeSkjema(personType, barn, erDød);

    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilBarnetrygdsperiode({
            mottarEøsBarnetrygdNå: {
                id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå,
                svar: mottarEøsBarnetrygdNå.verdi,
            },
            barnetrygdsland: {
                id: BarnetrygdperiodeSpørsmålId.barnetrygdsland,
                svar: barnetrygdsland.verdi,
            },
            fraDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode,
                svar: fraDatoBarnetrygdperiode.verdi,
            },
            tilDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode,
                svar: tilDatoBarnetrygdperiode.erSynlig ? tilDatoBarnetrygdperiode.verdi : '',
            },
            månedligBeløp: {
                id: BarnetrygdperiodeSpørsmålId.månedligBeløp,
                svar: trimWhiteSpace(månedligBeløp.verdi),
            },
        });

        toggleModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.verdi === ESvar.NEI ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = barnetrygdperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const spørsmålSpråkTekst = (spørsmålId: BarnetrygdperiodeSpørsmålId) => (
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
                    felt={skjema.felter.mottarEøsBarnetrygdNå}
                    spørsmålTekstId={hentSpørsmålTekstId(
                        BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå
                    )}
                    språkValues={{ barn: barn.navn }}
                />

                {barnetrygdsland.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.barnetrygdsland}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.barnetrygdsland)}
                        kunEøs={true}
                        dynamisk
                        ekskluderNorge
                    />
                )}
                {fraDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(
                            BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode
                        )}
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {tilDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.tilDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={spørsmålSpråkTekst(
                            BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode
                        )}
                        avgrensMinDato={skjema.felter.fraDatoBarnetrygdperiode.verdi}
                        avgrensMaxDato={dagensDato()}
                        calendarPosition={'fullscreen'}
                    />
                )}
                {månedligBeløp.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.månedligBeløp}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={hentSpørsmålTekstId(
                            BarnetrygdperiodeSpørsmålId.månedligBeløp
                        )}
                        språkValues={{
                            ...(barn && {
                                barn: barn.navn,
                            }),
                        }}
                        tilleggsinfo={
                            <StyledAlertStripe>
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
