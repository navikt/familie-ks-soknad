import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import {
    harTilhørendeFomFelt,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
    hentMinAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import TekstBlock from '../TekstBlock';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import { useUtenlandsoppholdSkjema } from './useUtenlandsoppholdSkjema';
import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from './utenlandsoppholdSpråkUtils';

type Props = ReturnType<typeof useModal> & {
    onLeggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    personType: PersonType;
    barn?: IBarnMedISøknad;
};

export const UtenlandsoppholdModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilUtenlandsperiode,
    personType,
    barn,
}) => {
    const { tekster, plainTekst } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtenlandsoppholdSkjema({
            personType,
        });

    const teksterForPersonType = tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    const barnetsNavn = barn?.navn;

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
            tittel={teksterForPersonType.tittel}
            flettefelter={{ barnetsNavn }}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
            onSubmitCallback={onLeggTil}
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
                            <TekstBlock block={teksterForPersonType.periodeBeskrivelse.sporsmal} />
                        }
                        skjema={skjema}
                        placeholder={plainTekst(teksterForPersonType.valgalternativPlaceholder)}
                    >
                        {Object.keys(EUtenlandsoppholdÅrsak).map((årsak, number) => (
                            <option key={number} value={årsak}>
                                {plainTekst(
                                    hentUtenlandsoppholdÅrsak(
                                        årsak as EUtenlandsoppholdÅrsak,
                                        teksterForPersonType
                                    )
                                )}
                            </option>
                        ))}
                    </StyledDropdown>
                </div>
                <LandDropdown
                    felt={skjema.felter.oppholdsland}
                    skjema={skjema}
                    label={
                        <TekstBlock
                            block={hentLandSpørsmål(
                                skjema.felter.utenlandsoppholdÅrsak.verdi,
                                teksterForPersonType
                            )}
                        />
                    }
                    dynamisk
                    ekskluderNorge
                />

                {skjema.felter.oppholdslandFraDato.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.oppholdslandFraDato}
                        label={
                            <TekstBlock
                                block={hentFraDatoSpørsmål(
                                    skjema.felter.utenlandsoppholdÅrsak.verdi,
                                    teksterForPersonType
                                )}
                            />
                        }
                        skjema={skjema}
                        avgrensMaxDato={hentMaxAvgrensningPåFraDato(
                            skjema.felter.utenlandsoppholdÅrsak.verdi
                        )}
                    />
                )}
                <>
                    {skjema.felter.oppholdslandTilDato.erSynlig && (
                        <Datovelger
                            felt={skjema.felter.oppholdslandTilDato}
                            label={
                                <TekstBlock
                                    block={hentTilDatoSpørsmål(
                                        skjema.felter.utenlandsoppholdÅrsak.verdi,
                                        teksterForPersonType
                                    )}
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
                        />
                    )}
                    {skjema.felter.oppholdslandTilDatoUkjent.erSynlig && (
                        <SkjemaCheckbox
                            felt={skjema.felter.oppholdslandTilDatoUkjent}
                            label={plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)}
                        />
                    )}
                </>
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
