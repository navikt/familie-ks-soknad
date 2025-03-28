import React from 'react';

import { Alert, Box } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IEøsKontantstøttePeriode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IEøsYtelseTekstinnhold } from '../../../typer/sanity/modaler/eøsYtelse';
import {
    dagenEtterDato,
    dagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForPeriode } from '../../../utils/perioder';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import TekstBlock from '../TekstBlock';

import { KontantstøttePeriodeSpørsmålId } from './spørsmål';
import {
    IUsePensjonsperiodeSkjemaParams,
    useKontantstøttePeriodeSkjema,
} from './useKontantstøttePeriodeSkjema';

interface Props extends IUsePensjonsperiodeSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    barn: IBarnMedISøknad;
    forklaring?: string;
}

export const KontantstøttePeriodeModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilKontantstøttePeriode,
    barn,
    personType,
    erDød = false,
    forklaring = undefined,
}) => {
    const { toggles } = useFeatureToggles();
    const { tekster } = useAppContext();
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

        lukkModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        mottarEøsKontantstøtteNå.verdi === ESvar.NEI ||
        (personType === PersonType.andreForelder && erDød);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForPersonType.tittel}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
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
            {toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO] ? (
                <>
                    {fraDatoKontantstøttePeriode.erSynlig && (
                        <MånedÅrVelger
                            felt={skjema.felter.fraDatoKontantstøttePeriode}
                            label={<TekstBlock block={teksterForPersonType.startdato.sporsmal} />}
                            senesteValgbareMåned={
                                periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                            }
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.FØRSTE_DAG}
                            kanIkkeVæreFremtid={true}
                        />
                    )}
                    {tilDatoKontantstøttePeriode.erSynlig && (
                        <MånedÅrVelger
                            felt={skjema.felter.tilDatoKontantstøttePeriode}
                            label={<TekstBlock block={teksterForPersonType.sluttdato.sporsmal} />}
                            tidligsteValgbareMåned={minTilDatoForPeriode(
                                periodenErAvsluttet,
                                skjema.felter.fraDatoKontantstøttePeriode.verdi
                            )}
                            senesteValgbareMåned={
                                periodenErAvsluttet ? sisteDagDenneMåneden() : undefined
                            }
                            dagIMåneden={DagIMåneden.SISTE_DAG}
                            kanIkkeVæreFremtid={periodenErAvsluttet}
                            kanIkkeVæreFortid={!periodenErAvsluttet}
                        />
                    )}
                </>
            ) : (
                <>
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
                                          stringTilDate(
                                              skjema.felter.fraDatoKontantstøttePeriode.verdi
                                          )
                                      )
                                    : undefined
                            }
                            avgrensMaxDato={dagensDato()}
                        />
                    )}
                </>
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
                        <Box marginBlock="2">
                            <Alert variant={'info'} inline>
                                <TekstBlock block={teksterForPersonType.beloepPerMaaned.alert} />
                            </Alert>
                        </Box>
                    }
                    htmlSize={15}
                />
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
