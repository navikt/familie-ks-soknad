import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { formaterDatoMedUkjent } from '../../../../../utils/dato';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const AndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
}> = ({ barn, andreForelder }) => {
    const intl = useIntl();
    const { formatMessage } = intl;

    return (
        <>
            <StyledOppsummeringsFeltGruppe>
                {andreForelder[andreForelderDataKeySpørsmål.navn].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.andre-forelder'} />}
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.navn].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? andreForelder[andreForelderDataKeySpørsmål.navn].svar
                                : formatMessage({
                                      id: omBarnetSpørsmålSpråkId[
                                          OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                                      ],
                                  })
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.fnr].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnr]}
                            />
                        }
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.fnr].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? andreForelder[andreForelderDataKeySpørsmål.fnr].svar
                                : formatMessage({
                                      id: omBarnetSpørsmålSpråkId[
                                          OmBarnetSpørsmålsId.andreForelderFnrUkjent
                                      ],
                                  })
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFødselsdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            andreForelder[andreForelderDataKeySpørsmål.fødselsdato].svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                ],
                            })
                        )}
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.yrkesaktivFemÅr].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[andreForelderDataKeySpørsmål.yrkesaktivFemÅr]
                                            .id
                                    ]
                                }
                            />
                        }
                        søknadsvar={
                            andreForelder[andreForelderDataKeySpørsmål.yrkesaktivFemÅr].svar
                        }
                    />
                )}
                {andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet]
                                            .id
                                    ]
                                }
                                values={{ navn: barn.navn }}
                            />
                        }
                        søknadsvar={andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar}
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

                {andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].id
                                    ]
                                }
                                values={{ navn: barn.navn }}
                            />
                        }
                        søknadsvar={andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar}
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
        </>
    );
};

export default AndreForelderOppsummering;
