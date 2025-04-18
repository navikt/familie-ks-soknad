import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { AlternativtSvarForInput, Typografi } from '../../../typer/common';
import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IOmBarnetFeltTyper } from '../../../typer/skjema';
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
import { Utenlandsperiode } from '../../Felleskomponenter/UtenlandsoppholdModal/Utenlandsperiode';
import AndreForelderOppsummering from '../Oppsummering/OppsummeringSteg/OmBarnet/AndreForelderOppsummering';

import SammeSomAnnetBarnRadio from './SammeSomAnnetBarnRadio';

const AndreForelder: React.FC<{
    barn: IBarnMedISøknad;
    skjema: ISkjema<IOmBarnetFeltTyper, string>;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
}> = ({
    barn,
    skjema,
    andreBarnSomErFyltUt,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
    leggTilUtenlandsperiode,
    fjernUtenlandsperiode,
}) => {
    const { tekster, plainTekst } = useAppContext();
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
        utenlandsoppholdUtenArbeidAndreForelder,
    } = teksterForSteg;

    const andreForelderErDød = barn.andreForelderErDød.svar === ESvar.JA;

    return (
        <SkjemaFieldset legend={plainTekst(barnetsAndreForelder)}>
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
                    <div>
                        <SkjemaFeltInput
                            felt={skjema.felter.andreForelderNavn}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={<TekstBlock block={navnAndreForelder.sporsmal} />}
                            disabled={
                                skjema.felter.andreForelderKanIkkeGiOpplysninger.verdi === ESvar.JA
                            }
                        />
                        <SkjemaCheckbox
                            label={plainTekst(navnAndreForelder.checkboxLabel)}
                            felt={skjema.felter.andreForelderKanIkkeGiOpplysninger}
                        />
                    </div>
                    {skjema.felter.andreForelderFnr.erSynlig && (
                        <div>
                            <SkjemaFeltInput
                                felt={skjema.felter.andreForelderFnr}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                label={
                                    <TekstBlock
                                        block={foedselsnummerDnummerAndreForelder.sporsmal}
                                    />
                                }
                                disabled={skjema.felter.andreForelderFnrUkjent.verdi === ESvar.JA}
                            />
                            <SkjemaCheckbox
                                label={plainTekst(foedselsnummerDnummerAndreForelder.checkboxLabel)}
                                felt={skjema.felter.andreForelderFnrUkjent}
                            />
                        </div>
                    )}
                    {skjema.felter.andreForelderFødselsdato.erSynlig && (
                        <div>
                            <Datovelger
                                felt={skjema.felter.andreForelderFødselsdato}
                                skjema={skjema}
                                label={<TekstBlock block={foedselsdatoAndreForelder.sporsmal} />}
                                avgrensMaxDato={dagensDato()}
                                disabled={
                                    skjema.felter.andreForelderFødselsdatoUkjent.verdi === ESvar.JA
                                }
                                strategy={'absolute'}
                            />
                            <SkjemaCheckbox
                                label={plainTekst(foedselsdatoAndreForelder.checkboxLabel)}
                                felt={skjema.felter.andreForelderFødselsdatoUkjent}
                            />
                        </div>
                    )}
                    {skjema.felter.andreForelderYrkesaktivFemÅr.erSynlig && (
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.andreForelderYrkesaktivFemÅr}
                            spørsmålDokument={medlemAvFolktetrygdenAndreForelder}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    )}
                    {skjema.felter.andreForelderArbeidUtlandet.erSynlig && (
                        <>
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
                                erDød={andreForelderErDød}
                                registrerteArbeidsperioder={
                                    skjema.felter.andreForelderArbeidsperioderUtland
                                }
                            />
                            <KomponentGruppe>
                                <JaNeiSpm
                                    skjema={skjema}
                                    felt={skjema.felter.andreForelderUtenlandsoppholdUtenArbeid}
                                    spørsmålDokument={utenlandsoppholdUtenArbeidAndreForelder}
                                    tilleggsinfo={
                                        <TekstBlock
                                            block={utenlandsoppholdUtenArbeidAndreForelder.alert}
                                            typografi={Typografi.BodyShort}
                                        />
                                    }
                                    flettefelter={{ barnetsNavn: barn?.navn }}
                                    inkluderVetIkke
                                />
                                {skjema.felter.andreForelderUtenlandsoppholdUtenArbeid.verdi ===
                                    ESvar.JA && (
                                    <Utenlandsperiode
                                        personType={PersonType.andreForelder}
                                        skjema={skjema}
                                        leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                                        fjernUtenlandsperiode={fjernUtenlandsperiode}
                                        registrerteUtenlandsperioder={
                                            skjema.felter.andreForelderUtenlandsperioder
                                        }
                                        barn={barn}
                                    />
                                )}
                            </KomponentGruppe>
                            <Pensjonsperiode
                                skjema={skjema}
                                mottarEllerMottattPensjonFelt={
                                    skjema.felter.andreForelderPensjonUtland
                                }
                                leggTilPensjonsperiode={leggTilPensjonsperiode}
                                fjernPensjonsperiode={fjernPensjonsperiode}
                                gjelderUtlandet={true}
                                personType={PersonType.andreForelder}
                                erDød={andreForelderErDød}
                                barn={barn}
                                registrertePensjonsperioder={
                                    skjema.felter.andreForelderPensjonsperioderUtland
                                }
                            />
                        </>
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
        </SkjemaFieldset>
    );
};

export default AndreForelder;
