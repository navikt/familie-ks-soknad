import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/barn';
import {
    IBarnehageplassPeriode,
    IEøsKontantstøttePeriode,
    IUtenlandsperiode,
} from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { dagensDato, erSammeDatoSomDagensDato, morgendagensDato } from '../../../utils/dato';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import { BarnehageplassPeriode } from '../../Felleskomponenter/Barnehagemodal/BarnehageplassPeriode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { KontantstøttePeriode } from '../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriode';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { Utenlandsperiode } from '../../Felleskomponenter/UtenlandsoppholdModal/Utenlandsperiode';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const Oppfølgningsspørsmål: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    leggTilKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    fjernKontantstøttePeriode: (periode: IEøsKontantstøttePeriode) => void;
    registrerteEøsKontantstøttePerioder: Felt<IEøsKontantstøttePeriode[]>;
    leggTilBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    fjernBarnehageplassPeriode: (periode: IBarnehageplassPeriode) => void;
    registrerteBarnehageplassPerioder: Felt<IBarnehageplassPeriode[]>;
}> = ({
    barn,
    skjema,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
    leggTilKontantstøttePeriode,
    fjernKontantstøttePeriode,
    registrerteEøsKontantstøttePerioder,
    leggTilBarnehageplassPeriode,
    fjernBarnehageplassPeriode,
    registrerteBarnehageplassPerioder,
}) => {
    return (
        <>
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <KomponentGruppe>
                    <Informasjonsbolk
                        tittelId={'ombarnet.fosterbarn'}
                        språkValues={{ navn: barn.navn }}
                    >
                        <VedleggNotis språkTekstId={'ombarnet.fosterbarn.vedleggsinfo'} />
                    </Informasjonsbolk>
                </KomponentGruppe>
            )}

            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <SkjemaFieldset tittelId={'ombarnet.institusjon'} språkValues={{ navn: barn.navn }}>
                    <SkjemaCheckbox
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonIUtland]
                        }
                        felt={skjema.felter.institusjonIUtlandCheckbox}
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsnavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsnavn]
                        }
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsadresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonsadresse]
                        }
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonspostnummer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.institusjonspostnummer]
                        }
                        bredde={'S'}
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdStartdato}
                        skjema={skjema}
                        avgrensMaxDato={dagensDato()}
                        label={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdStartdato
                                    ]
                                }
                            />
                        }
                    />
                    <>
                        <Datovelger
                            felt={skjema.felter.institusjonOppholdSluttdato}
                            avgrensMinDato={
                                erSammeDatoSomDagensDato(
                                    skjema.felter.institusjonOppholdStartdato.verdi
                                )
                                    ? morgendagensDato()
                                    : dagensDato()
                            }
                            skjema={skjema}
                            label={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.institusjonOppholdSluttdato
                                        ]
                                    }
                                />
                            }
                            disabled={
                                skjema.felter.institusjonOppholdSluttVetIkke.verdi === ESvar.JA
                            }
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.institusjonOppholdVetIkke
                                ]
                            }
                            felt={skjema.felter.institusjonOppholdSluttVetIkke}
                        />
                    </>
                </SkjemaFieldset>
            )}
            {skjema.felter.utbetaltForeldrepengerEllerEngangsstønad.erSynlig && (
                <KomponentGruppe>
                    <Informasjonsbolk
                        //TODO tekst om at barnet er adoptert
                        tittelId={'todo.ombarnet.utbetalt.foreldrepenger.engangsstønad'}
                    />
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.utbetaltForeldrepengerEllerEngangsstønad}
                        spørsmålTekstId={'todo.ombarnet.utbetalt.foreldrepenger.engangsstønad'}
                    />
                </KomponentGruppe>
            )}
            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.opplystatbarnutlandopphold.info'}
                    språkValues={{ navn: barn.navn }}
                >
                    <>
                        <Utenlandsperiode
                            personType={PersonType.barn}
                            skjema={skjema}
                            leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                            fjernPeriodeUtenlandsperiode={fjernUtenlandsperiode}
                            registrerteUtenlandsperioder={
                                skjema.felter.barnRegistrerteUtenlandsperioder
                            }
                            barn={barn}
                        />
                    </>
                    {skjema.felter.planleggerÅBoINorge12Mnd.erSynlig && (
                        <KomponentGruppe inline dynamisk>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.planleggerÅBoINorge12Mnd}
                                spørsmålTekstId={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd
                                    ]
                                }
                                språkValues={{ barn: barn.navn }}
                            />
                            {skjema.felter.planleggerÅBoINorge12Mnd.verdi === ESvar.NEI && (
                                <AlertStripe variant={'warning'} dynamisk>
                                    <SpråkTekst
                                        id={'ombarnet.planlagt-sammenhengende-opphold.alert'}
                                    />
                                </AlertStripe>
                            )}
                        </KomponentGruppe>
                    )}
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA && (
                <SkjemaFieldset
                    tittelId={'ombarnet.barnetrygd-eøs'}
                    språkValues={{ navn: barn.navn }}
                >
                    <KomponentGruppe>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.pågåendeSøknadFraAnnetEøsLand}
                            spørsmålTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand
                                ]
                            }
                        />
                        {skjema.felter.pågåendeSøknadHvilketLand.erSynlig && (
                            <LandDropdown
                                felt={skjema.felter.pågåendeSøknadHvilketLand}
                                skjema={skjema}
                                kunEøs={true}
                                ekskluderNorge
                                label={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand
                                            ]
                                        }
                                    />
                                }
                            />
                        )}
                        <KontantstøttePeriode
                            skjema={skjema}
                            registrerteEøsKontantstøttePerioder={
                                registrerteEøsKontantstøttePerioder
                            }
                            tilhørendeJaNeiSpmFelt={skjema.felter.mottarEllerMottokEøsKontantstøtte}
                            leggTilKontantstøttePeriode={leggTilKontantstøttePeriode}
                            fjernKontantstøttePeriode={fjernKontantstøttePeriode}
                            barn={barn}
                            personType={PersonType.søker}
                        />
                    </KomponentGruppe>
                </SkjemaFieldset>
            )}
            {barn[barnDataKeySpørsmål.harBarnehageplass].svar === ESvar.JA && (
                <KomponentGruppe>
                    <BarnehageplassPeriode
                        skjema={skjema}
                        registrerteBarnehageplassPerioder={registrerteBarnehageplassPerioder}
                        leggTilBarnehageplassPeriode={leggTilBarnehageplassPeriode}
                        fjernBarnehageplassPeriode={fjernBarnehageplassPeriode}
                        barn={barn}
                    />
                </KomponentGruppe>
            )}
        </>
    );
};

export default Oppfølgningsspørsmål;
