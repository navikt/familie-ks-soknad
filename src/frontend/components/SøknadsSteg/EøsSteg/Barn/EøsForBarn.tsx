import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { PersonType } from '../../../../typer/personType';
import { skalSkjuleAndreForelderFelt } from '../../../../utils/barn';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { Barnetrygdperiode } from '../../../Felleskomponenter/Barnetrygdperiode/Barnetrygdperiode';
import { LandDropdown } from '../../../Felleskomponenter/Dropdowns/LandDropdown';
import SlektsforholdDropdown from '../../../Felleskomponenter/Dropdowns/SlektsforholdDropdown';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import EøsAndreForelderOppsummering from '../../Oppsummering/OppsummeringSteg/Eøs/EøsAndreForelderOppsummering';
import IdNummerForAndreForelder from './IdNummerForAndreForelder';
import Omsorgsperson from './Omsorgsperson';
import SamletIdNummerForBarn from './SamletIdNummerForBarn';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';
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
        leggTilBarnetrygdsperiodeAndreForelder,
        fjernBarnetrygdsperiodeAndreForelder,
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
        leggTilBarnetrygdsperiodeOmsorgsperson,
        fjernBarnetrygdsperiodeOmsorgsperson,
    } = useEøsForBarn(barnetsId);
    const intl = useIntl();
    const { søknad } = useApp();

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id && !!barnISøknad.andreForelder
    );

    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar
    );

    return (
        <Steg
            tittel={<SpråkTekst id={'eøs-om-barn.sidetittel'} values={{ barn: barn.navn }} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <SamletIdNummerForBarn
                barn={barn}
                settIdNummerFelter={settIdNummerFelterForBarn}
                skjema={skjema}
            />

            {skjema.felter.søkersSlektsforhold.erSynlig && (
                <KomponentGruppe>
                    <SlektsforholdDropdown
                        felt={skjema.felter.søkersSlektsforhold}
                        skjema={skjema}
                        placeholder={intl.formatMessage({ id: 'felles.velgslektsforhold.spm' })}
                        label={
                            <SpråkTekst
                                id={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.søkersSlektsforhold]}
                                values={{ barn: barn.navn }}
                            />
                        }
                        gjelderSøker={true}
                    />
                    {skjema.felter.søkersSlektsforholdSpesifisering.erSynlig && (
                        <SkjemaFeltInput
                            felt={skjema.felter.søkersSlektsforholdSpesifisering}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={
                                eøsBarnSpørsmålSpråkId[
                                    EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering
                                ]
                            }
                            språkValues={{
                                barn: barn.navn,
                            }}
                        />
                    )}
                </KomponentGruppe>
            )}

            {(skjema.felter.borMedAndreForelder.erSynlig ||
                skjema.felter.borMedOmsorgsperson.erSynlig) && (
                <KomponentGruppe>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borMedAndreForelder}
                        spørsmålTekstId={
                            eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.borMedAndreForelder]
                        }
                        språkValues={{ barn: barn.navn }}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.borMedOmsorgsperson}
                        spørsmålTekstId={
                            eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.borMedOmsorgsperson]
                        }
                        språkValues={{ barn: barn.navn }}
                    />
                </KomponentGruppe>
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
                        leggTilBarnetrygdsperiodeOmsorgsperson,
                        fjernBarnetrygdsperiodeOmsorgsperson,
                    }}
                />
            )}

            {skjema.felter.barnetsAdresse.erSynlig && (
                <KomponentGruppe>
                    <SkjemaFeltInput
                        felt={skjema.felter.barnetsAdresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        description={<SpråkTekst id={'felles.hjelpetekst.fulladresse'} />}
                        labelSpråkTekstId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresse]}
                        språkValues={{ barn: barn.navn }}
                        disabled={skjema.felter.barnetsAdresseVetIkke.verdi === ESvar.JA}
                    />

                    <SkjemaCheckbox
                        felt={skjema.felter.barnetsAdresseVetIkke}
                        labelSpråkTekstId={
                            eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresseVetIkke]
                        }
                    />
                </KomponentGruppe>
            )}

            {!skalSkjuleAndreForelderFelt(barn) && (
                <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
                    {!barnMedSammeForelder ? (
                        <>
                            <IdNummerForAndreForelder
                                skjema={skjema}
                                settIdNummerFelter={settIdNummerFelterForAndreForelder}
                                barn={barn}
                            />

                            {skjema.felter.andreForelderAdresse.erSynlig && (
                                <KomponentGruppe>
                                    <>
                                        <SkjemaFeltInput
                                            felt={skjema.felter.andreForelderAdresse}
                                            visFeilmeldinger={skjema.visFeilmeldinger}
                                            labelSpråkTekstId={
                                                eøsBarnSpørsmålSpråkId[
                                                    EøsBarnSpørsmålId.andreForelderAdresse
                                                ]
                                            }
                                            description={
                                                <SpråkTekst id={'felles.hjelpetekst.fulladresse'} />
                                            }
                                            disabled={
                                                skjema.felter.andreForelderAdresseVetIkke.verdi ===
                                                ESvar.JA
                                            }
                                            språkValues={{ barn: barn.navn }}
                                        />
                                        <SkjemaCheckbox
                                            felt={skjema.felter.andreForelderAdresseVetIkke}
                                            labelSpråkTekstId={
                                                eøsBarnSpørsmålSpråkId[
                                                    EøsBarnSpørsmålId.andreForelderAdresseVetIkke
                                                ]
                                            }
                                        />
                                    </>
                                </KomponentGruppe>
                            )}

                            <KomponentGruppe>
                                <Arbeidsperiode
                                    skjema={skjema}
                                    leggTilArbeidsperiode={leggTilArbeidsperiodeNorgeAndreForelder}
                                    fjernArbeidsperiode={fjernArbeidsperiodeNorgeAndreForelder}
                                    arbeiderEllerArbeidetFelt={
                                        skjema.felter.andreForelderArbeidNorge
                                    }
                                    registrerteArbeidsperioder={
                                        skjema.felter.andreForelderArbeidsperioderNorge
                                    }
                                    personType={PersonType.AndreForelder}
                                    erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                    barn={barn}
                                />
                                <Pensjonsperiode
                                    skjema={skjema}
                                    mottarEllerMottattPensjonFelt={
                                        skjema.felter.andreForelderPensjonNorge
                                    }
                                    leggTilPensjonsperiode={
                                        leggTilPensjonsperiodeNorgeAndreForelder
                                    }
                                    fjernPensjonsperiode={fjernPensjonsperiodeNorgeAndreForelder}
                                    personType={PersonType.AndreForelder}
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
                                    fjernUtbetalingsperiode={
                                        fjernAndreUtbetalingsperiodeAndreForelder
                                    }
                                    personType={PersonType.AndreForelder}
                                    erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                    barn={barn}
                                    registrerteUtbetalingsperioder={
                                        skjema.felter.andreForelderAndreUtbetalingsperioder
                                    }
                                />

                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.andreForelderPågåendeSøknadFraAnnetEøsLand}
                                    spørsmålTekstId={
                                        eøsBarnSpørsmålSpråkId[
                                            EøsBarnSpørsmålId
                                                .andreForelderPågåendeSøknadFraAnnetEøsLand
                                        ]
                                    }
                                    språkValues={{ barn: barn.navn }}
                                    inkluderVetIkke
                                />
                                {skjema.felter.andreForelderPågåendeSøknadHvilketLand.erSynlig && (
                                    <LandDropdown
                                        felt={skjema.felter.andreForelderPågåendeSøknadHvilketLand}
                                        skjema={skjema}
                                        kunEøs={true}
                                        ekskluderNorge
                                        label={
                                            <SpråkTekst
                                                id={
                                                    eøsBarnSpørsmålSpråkId[
                                                        EøsBarnSpørsmålId
                                                            .andreForelderPågåendeSøknadHvilketLand
                                                    ]
                                                }
                                                values={{ barn: barn.navn }}
                                            />
                                        }
                                    />
                                )}

                                <Barnetrygdperiode
                                    skjema={skjema}
                                    tilhørendeJaNeiSpmFelt={
                                        skjema.felter.andreForelderBarnetrygdFraEøs
                                    }
                                    registrerteEøsBarnetrygdsperioder={
                                        skjema.felter.andreForelderEøsBarnetrygdsperioder
                                    }
                                    leggTilBarnetrygdsperiode={
                                        leggTilBarnetrygdsperiodeAndreForelder
                                    }
                                    fjernBarnetrygdsperiode={fjernBarnetrygdsperiodeAndreForelder}
                                    barn={barn}
                                    personType={PersonType.AndreForelder}
                                    erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                />
                            </KomponentGruppe>
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
