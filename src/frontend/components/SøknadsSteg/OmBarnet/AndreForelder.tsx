import React from 'react';

import { Heading } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
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
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import AndreForelderOppsummering from '../Oppsummering/OppsummeringSteg/OmBarnet/AndreForelderOppsummering';
import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
}> = ({
    barn,
    skjema,
    andreBarnSomErFyltUt,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
}) => {
    const { tekster, plainTekst } = useApp();
    const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
        annetBarn => annetBarn.id === skjema.felter.sammeForelderSomAnnetBarn.verdi
    );

    const teksterForSteg = tekster()[ESanitySteg.OM_BARNET];
    const {
        barnetsAndreForelder,
        navnAndreForelder,
        foedselsdatoAndreForelder,
        foedselsnummerDnummerAndreForelder,
        medlemAvFolktetrygdenAndreForelder,
    } = teksterForSteg;

    return (
        <SkjemaFieldset
            tittel={
                <Heading level={'2'} size={'xsmall'} spacing>
                    {plainTekst(barnetsAndreForelder)}
                </Heading>
            }
        >
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
                                    label={<TekstBlock block={navnAndreForelder.sporsmal} />}
                                    disabled={
                                        skjema.felter.andreForelderKanIkkeGiOpplysninger.verdi ===
                                        ESvar.JA
                                    }
                                />
                                <SkjemaCheckbox
                                    label={plainTekst(navnAndreForelder.checkboxLabel)}
                                    felt={skjema.felter.andreForelderKanIkkeGiOpplysninger}
                                />
                            </div>
                            {skjema.felter.andreForelderFnr.erSynlig && (
                                <KomponentGruppe inline dynamisk>
                                    <>
                                        <SkjemaFeltInput
                                            felt={skjema.felter.andreForelderFnr}
                                            visFeilmeldinger={skjema.visFeilmeldinger}
                                            label={
                                                <TekstBlock
                                                    block={
                                                        foedselsnummerDnummerAndreForelder.sporsmal
                                                    }
                                                />
                                            }
                                            disabled={
                                                skjema.felter.andreForelderFnrUkjent.verdi ===
                                                ESvar.JA
                                            }
                                        />
                                        <SkjemaCheckbox
                                            label={plainTekst(
                                                foedselsnummerDnummerAndreForelder.checkboxLabel
                                            )}
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
                                                <TekstBlock
                                                    block={foedselsdatoAndreForelder.sporsmal}
                                                />
                                            }
                                            avgrensMaxDato={dagensDato()}
                                            disabled={
                                                skjema.felter.andreForelderFødselsdatoUkjent
                                                    .verdi === ESvar.JA
                                            }
                                        />
                                        <SkjemaCheckbox
                                            label={plainTekst(
                                                foedselsdatoAndreForelder.checkboxLabel
                                            )}
                                            felt={skjema.felter.andreForelderFødselsdatoUkjent}
                                        />
                                    </>
                                </KomponentGruppe>
                            )}
                        </KomponentGruppe>
                        {skjema.felter.andreForelderYrkesaktivFemÅr.erSynlig && (
                            <KomponentGruppe>
                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.andreForelderYrkesaktivFemÅr}
                                    spørsmålDokument={medlemAvFolktetrygdenAndreForelder}
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
