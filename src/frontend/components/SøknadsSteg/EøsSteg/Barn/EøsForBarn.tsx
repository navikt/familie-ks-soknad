import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { PersonType } from '../../../../typer/personType';
import { skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { uppercaseFørsteBokstav } from '../../../../utils/visning';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { LandDropdown } from '../../../Felleskomponenter/Dropdowns/LandDropdown';
import SlektsforholdDropdown from '../../../Felleskomponenter/Dropdowns/SlektsforholdDropdown';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { KontantstøttePeriode } from '../../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriode';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import EøsAndreForelderOppsummering from '../../Oppsummering/OppsummeringSteg/Eøs/EøsAndreForelderOppsummering';

import IdNummerForAndreForelder from './IdNummerForAndreForelder';
import Omsorgsperson from './Omsorgsperson';
import SamletIdNummerForBarn from './SamletIdNummerForBarn';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        leggTilPensjonsperiodeNorgeAndreForelder,
        fjernPensjonsperiodeNorgeAndreForelder,
        leggTilAndreUtbetalingsperiodeAndreForelder,
        fjernAndreUtbetalingsperiodeAndreForelder,
        leggTilArbeidsperiodeNorgeAndreForelder,
        fjernArbeidsperiodeNorgeAndreForelder,
        leggTilKontantstøttePeriodeAndreForelder,
        fjernKontantstøttePeriodeAndreForelder,
        settIdNummerFelterForBarn,
        settIdNummerFelterForAndreForelder,
        leggTilArbeidsperiodeUtlandOmsorgsperson,
        fjernArbeidsperiodeUtlandOmsorgsperson,
        leggTilArbeidsperiodeNorgeOmsorgsperson,
        fjernArbeidsperiodeNorgeOmsorgsperson,
        leggTilPensjonsperiodeUtlandOmsorgsperson,
        fjernPensjonsperiodeUtlandOmsorgsperson,
        leggTilPensjonsperiodeNorgeOmsorgsperson,
        fjernPensjonsperiodeNorgeOmsorgsperson,
        leggTilAndreUtbetalingsperiodeOmsorgsperson,
        fjernAndreUtbetalingsperiodeOmsorgsperson,
        leggTilKontantstøttePeriodeOmsorgsperson,
        fjernKontantstøttePeriodeOmsorgsperson,
    } = useEøsForBarn(barnetsId);
    const { søknad, tekster, plainTekst } = useAppContext();

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id && !!barnISøknad.andreForelder
    );

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
    );

    const {
        eoesForBarnTittel,
        eosForBarnGuide,
        valgalternativSlektsforholdPlaceholder,
        hvilkenRelasjon,
        borMedAndreForelder,
        borMedOmsorgsperson,
        slektsforhold,
        hvorBorBarnet,
        subtittelAndreForelder,
        hvorBorAndreForelder,
        paagaaendeSoeknadYtelseAndreForelder,
        hvilketLandSoektYtelseAndreForelder,
    } = tekster().EØS_FOR_BARN;

    const barnetsNavn = barn.navn;

    return (
        <Steg
            tittel={uppercaseFørsteBokstav(plainTekst(eoesForBarnTittel, { barnetsNavn }))}
            guide={<TekstBlock block={eosForBarnGuide} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <div>
                <SamletIdNummerForBarn
                    barn={barn}
                    settIdNummerFelter={settIdNummerFelterForBarn}
                    skjema={skjema}
                />
            </div>
            {skjema.felter.søkersSlektsforhold.erSynlig && (
                <>
                    <SlektsforholdDropdown
                        felt={skjema.felter.søkersSlektsforhold}
                        skjema={skjema}
                        placeholder={plainTekst(valgalternativSlektsforholdPlaceholder)}
                        label={
                            <TekstBlock
                                block={slektsforhold.sporsmal}
                                flettefelter={{ barnetsNavn }}
                            />
                        }
                        gjelderSøker={true}
                    />
                    {skjema.felter.søkersSlektsforholdSpesifisering.erSynlig && (
                        <SkjemaFeltInput
                            felt={skjema.felter.søkersSlektsforholdSpesifisering}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={
                                <TekstBlock
                                    block={hvilkenRelasjon.sporsmal}
                                    flettefelter={{ barnetsNavn }}
                                />
                            }
                        />
                    )}
                </>
            )}
            {(skjema.felter.borMedAndreForelder.erSynlig ||
                skjema.felter.borMedOmsorgsperson.erSynlig) && (
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borMedAndreForelder}
                        spørsmålDokument={borMedAndreForelder}
                        flettefelter={{ barnetsNavn }}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borMedOmsorgsperson}
                        spørsmålDokument={borMedOmsorgsperson}
                        flettefelter={{ barnetsNavn }}
                    />
                </>
            )}
            {skjema.felter.borMedOmsorgsperson.verdi === ESvar.JA && (
                <Omsorgsperson
                    skjema={skjema}
                    barn={barn}
                    periodeFunksjoner={{
                        leggTilArbeidsperiodeUtlandOmsorgsperson,
                        fjernArbeidsperiodeUtlandOmsorgsperson,
                        leggTilArbeidsperiodeNorgeOmsorgsperson,
                        fjernArbeidsperiodeNorgeOmsorgsperson,
                        leggTilPensjonsperiodeUtlandOmsorgsperson,
                        fjernPensjonsperiodeUtlandOmsorgsperson,
                        leggTilPensjonsperiodeNorgeOmsorgsperson,
                        fjernPensjonsperiodeNorgeOmsorgsperson,
                        leggTilAndreUtbetalingsperiodeOmsorgsperson,
                        fjernAndreUtbetalingsperiodeOmsorgsperson,
                        leggTilKontantstøttePeriodeOmsorgsperson,
                        fjernKontantstøttePeriodeOmsorgsperson,
                    }}
                />
            )}
            {skjema.felter.barnetsAdresse.erSynlig && (
                <div>
                    <SkjemaFeltInput
                        felt={skjema.felter.barnetsAdresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        description={plainTekst(hvorBorBarnet.beskrivelse)}
                        label={
                            <TekstBlock
                                block={hvorBorBarnet.sporsmal}
                                flettefelter={{ barnetsNavn: barnetsNavn }}
                            />
                        }
                        disabled={skjema.felter.barnetsAdresseVetIkke.verdi === ESvar.JA}
                    />
                    <SkjemaCheckbox
                        felt={skjema.felter.barnetsAdresseVetIkke}
                        label={plainTekst(hvorBorBarnet.checkboxLabel)}
                    />
                </div>
            )}
            {!skalSkjuleAndreForelderFelt(barn) && (
                <SkjemaFieldset legend={plainTekst(subtittelAndreForelder, { barnetsNavn })}>
                    {!barnMedSammeForelder ? (
                        <>
                            <IdNummerForAndreForelder
                                skjema={skjema}
                                settIdNummerFelter={settIdNummerFelterForAndreForelder}
                                barn={barn}
                            />
                            {skjema.felter.andreForelderAdresse.erSynlig && (
                                <div>
                                    <SkjemaFeltInput
                                        felt={skjema.felter.andreForelderAdresse}
                                        visFeilmeldinger={skjema.visFeilmeldinger}
                                        label={
                                            <TekstBlock
                                                block={hvorBorAndreForelder.sporsmal}
                                                flettefelter={{ barnetsNavn: barnetsNavn }}
                                            />
                                        }
                                        description={plainTekst(hvorBorAndreForelder.beskrivelse)}
                                        disabled={
                                            skjema.felter.andreForelderAdresseVetIkke.verdi ===
                                            ESvar.JA
                                        }
                                    />
                                    <SkjemaCheckbox
                                        felt={skjema.felter.andreForelderAdresseVetIkke}
                                        label={plainTekst(hvorBorAndreForelder.checkboxLabel)}
                                    />
                                </div>
                            )}
                            <Arbeidsperiode
                                skjema={skjema}
                                leggTilArbeidsperiode={leggTilArbeidsperiodeNorgeAndreForelder}
                                fjernArbeidsperiode={fjernArbeidsperiodeNorgeAndreForelder}
                                arbeiderEllerArbeidetFelt={skjema.felter.andreForelderArbeidNorge}
                                registrerteArbeidsperioder={
                                    skjema.felter.andreForelderArbeidsperioderNorge
                                }
                                personType={PersonType.andreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                barn={barn}
                            />
                            <Pensjonsperiode
                                skjema={skjema}
                                mottarEllerMottattPensjonFelt={
                                    skjema.felter.andreForelderPensjonNorge
                                }
                                leggTilPensjonsperiode={leggTilPensjonsperiodeNorgeAndreForelder}
                                fjernPensjonsperiode={fjernPensjonsperiodeNorgeAndreForelder}
                                personType={PersonType.andreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                barn={barn}
                                gjelderUtlandet={false}
                                registrertePensjonsperioder={
                                    skjema.felter.andreForelderPensjonsperioderNorge
                                }
                            />
                            <Utbetalingsperiode
                                skjema={skjema}
                                tilhørendeJaNeiSpmFelt={
                                    skjema.felter.andreForelderAndreUtbetalinger
                                }
                                leggTilUtbetalingsperiode={
                                    leggTilAndreUtbetalingsperiodeAndreForelder
                                }
                                fjernUtbetalingsperiode={fjernAndreUtbetalingsperiodeAndreForelder}
                                personType={PersonType.andreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                barn={barn}
                                registrerteUtbetalingsperioder={
                                    skjema.felter.andreForelderAndreUtbetalingsperioder
                                }
                            />
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.andreForelderPågåendeSøknadFraAnnetEøsLand}
                                spørsmålDokument={paagaaendeSoeknadYtelseAndreForelder}
                                inkluderVetIkke
                                flettefelter={{ barnetsNavn: barnetsNavn }}
                            />
                            {skjema.felter.andreForelderPågåendeSøknadHvilketLand.erSynlig && (
                                <LandDropdown
                                    felt={skjema.felter.andreForelderPågåendeSøknadHvilketLand}
                                    skjema={skjema}
                                    kunEøs={true}
                                    ekskluderNorge
                                    label={
                                        <TekstBlock
                                            block={hvilketLandSoektYtelseAndreForelder.sporsmal}
                                            flettefelter={{ barnetsNavn: barnetsNavn }}
                                        />
                                    }
                                />
                            )}
                            <KontantstøttePeriode
                                skjema={skjema}
                                tilhørendeJaNeiSpmFelt={
                                    skjema.felter.andreForelderKontantstøtteFraEøs
                                }
                                registrerteEøsKontantstøttePerioder={
                                    skjema.felter.andreForelderEøsKontantstøttePerioder
                                }
                                leggTilKontantstøttePeriode={
                                    leggTilKontantstøttePeriodeAndreForelder
                                }
                                fjernKontantstøttePeriode={fjernKontantstøttePeriodeAndreForelder}
                                barn={barn}
                                personType={PersonType.andreForelder}
                                erDød={barn.andreForelderErDød.svar === ESvar.JA}
                            />
                        </>
                    ) : (
                        barnMedSammeForelder?.andreForelder && (
                            <EøsAndreForelderOppsummering
                                barn={barn}
                                andreForelder={barnMedSammeForelder.andreForelder}
                                skjema={skjema}
                                settIdNummerFelter={settIdNummerFelterForAndreForelder}
                            />
                        )
                    )}
                </SkjemaFieldset>
            )}
        </Steg>
    );
};

export default EøsForBarn;
