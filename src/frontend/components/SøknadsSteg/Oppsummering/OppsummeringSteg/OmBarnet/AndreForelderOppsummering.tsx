import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../../context/AppContext';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { ESanitySteg } from '../../../../../typer/sanity/sanity';
import { formaterDatoMedUkjent } from '../../../../../utils/dato';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import { UtenlandsperiodeOppsummering } from '../../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { IOmBarnetTekstinnhold } from '../../../OmBarnet/innholdTyper';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const AndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
}> = ({ barn, andreForelder }) => {
    const { tekster, plainTekst } = useApp();
    const omBarnetTekster: IOmBarnetTekstinnhold = tekster()[ESanitySteg.OM_BARNET];
    const erDød = barn.andreForelderErDød.svar === ESvar.JA;

    const flettefelter = { barnetsNavn: barn.navn };
    return (
        <>
            {andreForelder[andreForelderDataKeySpørsmål.kanIkkeGiOpplysninger].svar ===
            ESvar.NEI ? (
                <StyledOppsummeringsFeltGruppe>
                    {andreForelder[andreForelderDataKeySpørsmål.navn].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={omBarnetTekster.navnAndreForelder.sporsmal}
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.navn].svar !==
                                AlternativtSvarForInput.UKJENT
                                    ? andreForelder[andreForelderDataKeySpørsmål.navn].svar
                                    : plainTekst(omBarnetTekster.navnAndreForelder.checkboxLabel)
                            }
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.fnr].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={
                                omBarnetTekster.foedselsnummerDnummerAndreForelder.sporsmal
                            }
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.fnr].svar !==
                                AlternativtSvarForInput.UKJENT
                                    ? andreForelder[andreForelderDataKeySpørsmål.fnr].svar
                                    : plainTekst(
                                          omBarnetTekster.foedselsnummerDnummerAndreForelder
                                              .checkboxLabel
                                      )
                            }
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={omBarnetTekster.foedselsdatoAndreForelder.sporsmal}
                            søknadsvar={formaterDatoMedUkjent(
                                andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar,
                                plainTekst(omBarnetTekster.foedselsdatoAndreForelder.checkboxLabel)
                            )}
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.yrkesaktivFemÅr].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={
                                omBarnetTekster.medlemAvFolktetrygdenAndreForelder.sporsmal
                            }
                            flettefelter={flettefelter}
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.yrkesaktivFemÅr].svar
                            }
                        />
                    )}
                    {andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={
                                erDød
                                    ? omBarnetTekster.arbeidUtenforNorgeAndreForelderGjenlevende
                                          .sporsmal
                                    : omBarnetTekster.arbeidUtenforNorgeAndreForelder.sporsmal
                            }
                            flettefelter={flettefelter}
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar
                            }
                        />
                    )}

                    {andreForelder.arbeidsperioderUtland.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            nummer={index + 1}
                            arbeidsperiode={periode}
                            gjelderUtlandet={true}
                            personType={PersonType.andreForelder}
                            erDød={barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA}
                            barn={barn}
                        />
                    ))}

                    <OppsummeringFelt
                        spørsmålstekst={
                            erDød
                                ? omBarnetTekster.utenlandsoppholdUtenArbeidAndreForelderGjenlevende
                                      .sporsmal
                                : omBarnetTekster.utenlandsoppholdUtenArbeidAndreForelder.sporsmal
                        }
                        flettefelter={flettefelter}
                        søknadsvar={andreForelder.utenlandsoppholdUtenArbeid.svar}
                    />

                    {andreForelder.utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            personType={PersonType.andreForelder}
                            erDød={erDød}
                            barn={barn}
                        />
                    ))}

                    {andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar && (
                        <OppsummeringFelt
                            spørsmålstekst={
                                erDød
                                    ? omBarnetTekster.pensjonUtlandAndreForelderGjenlevende.sporsmal
                                    : omBarnetTekster.pensjonUtlandAndreForelder.sporsmal
                            }
                            flettefelter={flettefelter}
                            søknadsvar={
                                andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar
                            }
                        />
                    )}

                    {andreForelder.pensjonsperioderUtland.map((periode, index) => (
                        <PensjonsperiodeOppsummering
                            key={`pensjonsperiode-utland-andre-forelder${index}`}
                            nummer={index + 1}
                            pensjonsperiode={periode}
                            gjelderUtlandet={true}
                            personType={PersonType.andreForelder}
                            erDød={barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA}
                            barn={barn}
                        />
                    ))}
                </StyledOppsummeringsFeltGruppe>
            ) : (
                <StyledOppsummeringsFeltGruppe>
                    <BodyShort>
                        {plainTekst(omBarnetTekster.navnAndreForelder.checkboxLabel)}
                    </BodyShort>
                </StyledOppsummeringsFeltGruppe>
            )}
        </>
    );
};

export default AndreForelderOppsummering;
