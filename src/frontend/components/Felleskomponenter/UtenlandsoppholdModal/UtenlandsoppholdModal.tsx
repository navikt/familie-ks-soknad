import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { tilDatoUkjentLabelSpråkId, UtenlandsoppholdSpørsmålId } from './spørsmål';
import {
    IUseUtenlandsoppholdSkjemaParams,
    useUtenlandsoppholdSkjema,
} from './useUtenlandsoppholdSkjema';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    årsakLabelSpråkId,
    årsakSpråkId,
} from './utenlandsoppholdSpråkUtils';

interface Props extends ReturnType<typeof useModal>, IUseUtenlandsoppholdSkjemaParams {
    onLeggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    personType: PersonType;
    barn?: IBarnMedISøknad;
}

export const UtenlandsoppholdModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilUtenlandsperiode,
    personType,
    barn,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtenlandsoppholdSkjema({
            personType,
        });

    const { formatMessage } = useIntl();

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtenlandsperiode({
            utenlandsoppholdÅrsak: {
                id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                svar: skjema.felter.utenlandsoppholdÅrsak.verdi as EUtenlandsoppholdÅrsak,
            },
            oppholdsland: {
                id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold,
                svar: skjema.felter.oppholdsland.verdi,
            },
            ...(skjema.felter.oppholdslandFraDato.erSynlig && {
                oppholdslandFraDato: {
                    id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
                    svar: skjema.felter.oppholdslandFraDato.verdi,
                },
            }),
            ...(skjema.felter.oppholdslandTilDato.erSynlig && {
                oppholdslandTilDato: {
                    id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
                    svar: svarForSpørsmålMedUkjent(
                        skjema.felter.oppholdslandTilDatoUkjent,
                        skjema.felter.oppholdslandTilDato
                    ),
                },
            }),
        });

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'modal.utenlandsopphold.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilutenlands.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <div>
                    <StyledDropdown<EUtenlandsoppholdÅrsak | ''>
                        {...skjema.felter.utenlandsoppholdÅrsak.hentNavInputProps(
                            skjema.visFeilmeldinger
                        )}
                        felt={skjema.felter.utenlandsoppholdÅrsak}
                        label={
                            <SpråkTekst
                                id={årsakLabelSpråkId(personType)}
                                values={{ ...(barn && { barn: barn.navn }) }}
                            />
                        }
                        skjema={skjema}
                        placeholder={formatMessage({ id: 'felles.velg-årsak.placeholder' })}
                        bredde={'fullbredde'}
                    >
                        {Object.keys(EUtenlandsoppholdÅrsak).map((årsak, number) => (
                            <option key={number} value={årsak}>
                                {formatMessage(
                                    {
                                        id: årsakSpråkId(
                                            årsak as EUtenlandsoppholdÅrsak,
                                            personType
                                        ),
                                    },
                                    { ...(barn && { barn: barn.navn }) }
                                )}
                            </option>
                        ))}
                    </StyledDropdown>
                </div>
                <LandDropdown
                    felt={skjema.felter.oppholdsland}
                    skjema={skjema}
                    label={
                        landLabelSpråkId(skjema.felter.utenlandsoppholdÅrsak.verdi, personType) && (
                            <SpråkTekst
                                id={landLabelSpråkId(
                                    skjema.felter.utenlandsoppholdÅrsak.verdi,
                                    personType
                                )}
                                values={{ ...(barn && { barn: barn.navn }) }}
                            />
                        )
                    }
                    dynamisk
                    ekskluderNorge
                />

                {skjema.felter.oppholdslandFraDato.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.oppholdslandFraDato}
                        label={
                            <SpråkTekst
                                id={fraDatoLabelSpråkId(
                                    skjema.felter.utenlandsoppholdÅrsak.verdi,
                                    personType
                                )}
                                values={{ ...(barn && { barn: barn.navn }) }}
                            />
                        }
                        skjema={skjema}
                        avgrensMaxDato={hentMaxAvgrensningPåFraDato(
                            skjema.felter.utenlandsoppholdÅrsak.verdi
                        )}
                        calendarPosition={'fullscreen'}
                    />
                )}
                <>
                    {skjema.felter.oppholdslandTilDato.erSynlig && (
                        <Datovelger
                            felt={skjema.felter.oppholdslandTilDato}
                            label={
                                <SpråkTekst
                                    id={tilDatoLabelSpråkId(
                                        skjema.felter.utenlandsoppholdÅrsak.verdi,
                                        personType
                                    )}
                                    values={{ ...(barn && { barn: barn.navn }) }}
                                />
                            }
                            skjema={skjema}
                            avgrensMinDato={hentMinAvgrensningPåTilDato(
                                skjema.felter.utenlandsoppholdÅrsak.verdi
                            )}
                            avgrensMaxDato={hentMaxAvgrensningPåTilDato(
                                skjema.felter.utenlandsoppholdÅrsak.verdi
                            )}
                            tilhørendeFraOgMedFelt={
                                harTilhørendeFomFelt(skjema.felter.utenlandsoppholdÅrsak.verdi)
                                    ? skjema.felter.oppholdslandFraDato
                                    : undefined
                            }
                            disabled={skjema.felter.oppholdslandTilDatoUkjent.verdi === ESvar.JA}
                            calendarPosition={'fullscreen'}
                        />
                    )}
                    {skjema.felter.oppholdslandTilDatoUkjent.erSynlig && (
                        <SkjemaCheckbox
                            felt={skjema.felter.oppholdslandTilDatoUkjent}
                            labelSpråkTekstId={tilDatoUkjentLabelSpråkId}
                        />
                    )}
                </>
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
