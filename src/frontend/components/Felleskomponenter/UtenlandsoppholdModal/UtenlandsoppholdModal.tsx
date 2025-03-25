import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
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
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import TekstBlock from '../TekstBlock';

import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import { useUtenlandsoppholdSkjema } from './useUtenlandsoppholdSkjema';
import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from './utenlandsoppholdSpråkUtils';

type Props = PeriodePersonTypeMedBarnProps & {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    forklaring?: string;
};

export const UtenlandsoppholdModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilUtenlandsperiode,
    personType,
    barn,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtenlandsoppholdSkjema({
            personType,
        });

    const teksterForPersonType = tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];
    const {
        utenlandsoppholdÅrsak,
        oppholdsland,
        oppholdslandTilDato,
        oppholdslandFraDato,
        oppholdslandTilDatoUkjent,
        adresseUkjent,
        adresse,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtenlandsperiode({
            utenlandsoppholdÅrsak: {
                id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                svar: utenlandsoppholdÅrsak.verdi as EUtenlandsoppholdÅrsak,
            },
            oppholdsland: {
                id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold,
                svar: oppholdsland.verdi,
            },
            oppholdslandFraDato: {
                id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
                svar: oppholdslandFraDato.verdi,
            },
            oppholdslandTilDato: {
                id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
                svar: svarForSpørsmålMedUkjent(oppholdslandTilDatoUkjent, oppholdslandTilDato),
            },
            adresse: {
                id: UtenlandsoppholdSpørsmålId.adresse,
                svar: svarForSpørsmålMedUkjent(adresseUkjent, adresse),
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    const adresseTekst: ISanitySpørsmålDokument | undefined =
        utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE ||
        utenlandsoppholdÅrsak.verdi === EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE
            ? teksterForPersonType.adresseFortid
            : teksterForPersonType.adresseNaatid;

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForPersonType.tittel}
            forklaring={forklaring}
            flettefelter={{ barnetsNavn: barn?.navn }}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
            onSubmitCallback={onLeggTil}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <div>
                <StyledDropdown<EUtenlandsoppholdÅrsak | ''>
                    {...utenlandsoppholdÅrsak.hentNavInputProps(skjema.visFeilmeldinger)}
                    felt={utenlandsoppholdÅrsak}
                    label={<TekstBlock block={teksterForPersonType.periodeBeskrivelse.sporsmal} />}
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
                felt={oppholdsland}
                skjema={skjema}
                label={
                    <TekstBlock
                        block={hentLandSpørsmål(utenlandsoppholdÅrsak.verdi, teksterForPersonType)}
                        flettefelter={{ barnetsNavn: barn?.navn }}
                    />
                }
                dynamisk
                ekskluderNorge
            />
            {oppholdslandFraDato.erSynlig && (
                <Datovelger
                    felt={oppholdslandFraDato}
                    label={
                        <TekstBlock
                            block={hentFraDatoSpørsmål(
                                utenlandsoppholdÅrsak.verdi,
                                teksterForPersonType
                            )}
                        />
                    }
                    skjema={skjema}
                    avgrensMaxDato={hentMaxAvgrensningPåFraDato(utenlandsoppholdÅrsak.verdi)}
                />
            )}
            {(oppholdslandTilDato.erSynlig || oppholdslandTilDatoUkjent.erSynlig) && (
                <div>
                    {oppholdslandTilDato.erSynlig && (
                        <Datovelger
                            felt={oppholdslandTilDato}
                            label={
                                <TekstBlock
                                    block={hentTilDatoSpørsmål(
                                        utenlandsoppholdÅrsak.verdi,
                                        teksterForPersonType
                                    )}
                                />
                            }
                            skjema={skjema}
                            avgrensMinDato={hentMinAvgrensningPåTilDato(
                                utenlandsoppholdÅrsak.verdi
                            )}
                            avgrensMaxDato={hentMaxAvgrensningPåTilDato(
                                utenlandsoppholdÅrsak.verdi
                            )}
                            tilhørendeFraOgMedFelt={
                                harTilhørendeFomFelt(utenlandsoppholdÅrsak.verdi)
                                    ? oppholdslandFraDato
                                    : undefined
                            }
                            disabled={oppholdslandTilDatoUkjent.verdi === ESvar.JA}
                        />
                    )}
                    {oppholdslandTilDatoUkjent.erSynlig && (
                        <SkjemaCheckbox
                            felt={oppholdslandTilDatoUkjent}
                            label={plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)}
                        />
                    )}
                </div>
            )}
            {adresse.erSynlig && (
                <div>
                    <SkjemaFeltInput
                        felt={adresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        label={plainTekst(adresseTekst?.sporsmal)}
                        disabled={adresseUkjent.verdi === ESvar.JA}
                        description={plainTekst(adresseTekst?.beskrivelse)}
                    />
                    <SkjemaCheckbox
                        felt={adresseUkjent}
                        label={plainTekst(adresseTekst?.checkboxLabel)}
                    />
                </div>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
