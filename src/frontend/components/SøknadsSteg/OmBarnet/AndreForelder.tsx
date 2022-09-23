import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { dagensDato } from '../../../utils/dato';
import { Arbeidsperiode } from '../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { Utenlandsperiode } from '../../Felleskomponenter/UtenlandsoppholdModal/Utenlandsperiode';
import AndreForelderOppsummering from '../Oppsummering/OppsummeringSteg/OmBarnet/AndreForelderOppsummering';
import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
}> = ({
    barn,
    skjema,
    andreBarnSomErFyltUt,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
}) => {
    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === skjema.felter.sammeForelderSomAnnetBarn.verdi
    );

    return (
        <SkjemaFieldset tittelId={'ombarnet.andre-forelder'}>
            <KomponentGruppe>
                {skjema.felter.sammeForelderSomAnnetBarn.erSynlig && (
                    <SammeSomAnnetBarnRadio
                        andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                        skjema={skjema}
                        barnetsNavn={barn.navn}
                    />
                )}
                {!skjema.felter.sammeForelderSomAnnetBarn.erSynlig ||
                skjema.felter.sammeForelderSomAnnetBarn.verdi ===
                    AlternativtSvarForInput.ANNEN_FORELDER ? (
                    <>
                        <KomponentGruppe>
                            <div>
                                <SkjemaFeltInput
                                    felt={skjema.felter.andreForelderNavn}
                                    visFeilmeldinger={skjema.visFeilmeldinger}
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderNavn
                                        ]
                                    }
                                    disabled={
                                        skjema.felter.andreForelderKanIkkeGiOpplysninger.verdi ===
                                        ESvar.JA
                                    }
                                />
                                <SkjemaCheckbox
                                    labelSpråkTekstId={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                                        ]
                                    }
                                    felt={skjema.felter.andreForelderKanIkkeGiOpplysninger}
                                />
                            </div>
                            {skjema.felter.andreForelderFnr.erSynlig && (
                                <KomponentGruppe inline dynamisk>
                                    <>
                                        <SkjemaFeltInput
                                            felt={skjema.felter.andreForelderFnr}
                                            visFeilmeldinger={skjema.visFeilmeldinger}
                                            labelSpråkTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.andreForelderFnr
                                                ]
                                            }
                                            disabled={
                                                skjema.felter.andreForelderFnrUkjent.verdi ===
                                                ESvar.JA
                                            }
                                        />
                                        <SkjemaCheckbox
                                            labelSpråkTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                                ]
                                            }
                                            felt={skjema.felter.andreForelderFnrUkjent}
                                        />
                                    </>
                                </KomponentGruppe>
                            )}
                            {skjema.felter.andreForelderFødselsdato.erSynlig && (
                                <KomponentGruppe inline dynamisk>
                                    <>
                                        <Datovelger
                                            felt={skjema.felter.andreForelderFødselsdato}
                                            skjema={skjema}
                                            label={
                                                <SpråkTekst
                                                    id={
                                                        omBarnetSpørsmålSpråkId[
                                                            OmBarnetSpørsmålsId
                                                                .andreForelderFødselsdato
                                                        ]
                                                    }
                                                />
                                            }
                                            avgrensMaxDato={dagensDato()}
                                            disabled={
                                                skjema.felter.andreForelderFødselsdatoUkjent
                                                    .verdi === ESvar.JA
                                            }
                                        />
                                        <SkjemaCheckbox
                                            labelSpråkTekstId={
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId
                                                        .andreForelderFødselsdatoUkjent
                                                ]
                                            }
                                            felt={skjema.felter.andreForelderFødselsdatoUkjent}
                                        />
                                    </>
                                </KomponentGruppe>
                            )}
                        </KomponentGruppe>
                        {skjema.felter.andreForelderVærtINorgeITolvMåneder.erSynlig && (
                            <KomponentGruppe>
                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.andreForelderVærtINorgeITolvMåneder}
                                    spørsmålTekstId={
                                        'todo andre forelder sammenhengende opphold norge?'
                                    }
                                />
                                {skjema.felter.andreForelderRegistrerteUtenlandsperioder
                                    .erSynlig && (
                                    <>
                                        <Utenlandsperiode
                                            personType={PersonType.andreForelder}
                                            skjema={skjema}
                                            leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                                            fjernUtenlandsperiode={fjernUtenlandsperiode}
                                            registrerteUtenlandsperioder={
                                                skjema.felter
                                                    .andreForelderRegistrerteUtenlandsperioder
                                            }
                                            barn={barn}
                                        />
                                    </>
                                )}
                            </KomponentGruppe>
                        )}
                        {skjema.felter.andreForelderPlanleggerÅBoINorgeTolvMnd.erSynlig && (
                            <KomponentGruppe inline dynamisk>
                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.andreForelderPlanleggerÅBoINorgeTolvMnd}
                                    spørsmålTekstId={
                                        'todo.andreforelder.utenlandsopphold.planlegger'
                                    }
                                />
                            </KomponentGruppe>
                        )}
                        {skjema.felter.andreForelderYrkesaktivFemÅr.erSynlig && (
                            <KomponentGruppe>
                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.andreForelderYrkesaktivFemÅr}
                                    spørsmålTekstId={'todo.andreforelder.yrkesaktiv'}
                                />
                            </KomponentGruppe>
                        )}
                        {skjema.felter.andreForelderArbeidUtlandet.erSynlig && (
                            <KomponentGruppe>
                                <Arbeidsperiode
                                    skjema={skjema}
                                    arbeiderEllerArbeidetFelt={
                                        skjema.felter.andreForelderArbeidUtlandet
                                    }
                                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                                    fjernArbeidsperiode={fjernArbeidsperiode}
                                    gjelderUtlandet
                                    personType={PersonType.andreForelder}
                                    barn={barn}
                                    erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                    registrerteArbeidsperioder={
                                        skjema.felter.andreForelderArbeidsperioderUtland
                                    }
                                />
                                <Pensjonsperiode
                                    skjema={skjema}
                                    mottarEllerMottattPensjonFelt={
                                        skjema.felter.andreForelderPensjonUtland
                                    }
                                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                                    fjernPensjonsperiode={fjernPensjonsperiode}
                                    gjelderUtlandet={true}
                                    personType={PersonType.andreForelder}
                                    erDød={barn.andreForelderErDød.svar === ESvar.JA}
                                    barn={barn}
                                    registrertePensjonsperioder={
                                        skjema.felter.andreForelderPensjonsperioderUtland
                                    }
                                />
                            </KomponentGruppe>
                        )}
                    </>
                ) : (
                    barnMedSammeForelder?.andreForelder && (
                        <AndreForelderOppsummering
                            barn={barn}
                            andreForelder={barnMedSammeForelder.andreForelder}
                        />
                    )
                )}
            </KomponentGruppe>
        </SkjemaFieldset>
    );
};

export default AndreForelder;
