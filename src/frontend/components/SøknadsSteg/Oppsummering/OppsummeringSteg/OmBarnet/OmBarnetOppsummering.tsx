import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useSteg } from '../../../../../context/StegContext';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { PersonType } from '../../../../../typer/personType';
import { formaterDato } from '../../../../../utils/dato';
import { landkodeTilSpråk } from '../../../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../../../utils/visning';
import { BarnehageplassPeriodeOppsummering } from '../../../../Felleskomponenter/Barnehagemodal/barnehageplassPeriodeOppsummering';
import { KontantstøttePeriodeOppsummering } from '../../../../Felleskomponenter/KontantstøttePeriode/KontantstøttePeriodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsperiodeOppsummering } from '../../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../../OmBarnet/spørsmål';
import { useOmBarnet } from '../../../OmBarnet/useOmBarnet';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import AndreForelderOppsummering from './AndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    nummer: string;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn, index }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const { hentStegObjektForBarn } = useSteg();
    const [valgtLocale] = useSprakContext();
    const omBarnetHook = useOmBarnet(barn.id);

    return (
        <Oppsummeringsbolk
            tittel={'oppsummering.deltittel.ombarnet'}
            språkValues={{ nummer, navn: barn.navn }}
            key={index}
            steg={hentStegObjektForBarn(barn)}
            skjemaHook={omBarnetHook}
            settFeilAnchors={settFeilAnchors}
        >
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'ombarnet.fosterbarn'} values={{ navn: barn.navn }} />}
                />
            )}
            {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst id={'ombarnet.institusjon'} values={{ navn: barn.navn }} />
                        }
                    />

                    {barn[barnDataKeySpørsmål.institusjonIUtland].svar === ESvar.JA ? (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.institusjonIUtland
                                        ]
                                    }
                                />
                            }
                        />
                    ) : (
                        <>
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.institusjonsnavn
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonsnavn].svar}
                            />

                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.institusjonsadresse
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonsadresse].svar}
                            />

                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            omBarnetSpørsmålSpråkId[
                                                OmBarnetSpørsmålsId.institusjonspostnummer
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.institusjonspostnummer].svar}
                            />
                        </>
                    )}

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdStartdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDato(
                            barn[barnDataKeySpørsmål.institusjonOppholdStartdato].svar
                        )}
                    />

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.institusjonOppholdSluttdato
                                    ]
                                }
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar,
                            formatMessage({
                                id: omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.institusjonOppholdVetIkke
                                ],
                            })
                        )}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.utbetaltForeldrepengerEllerEngangsstønad].svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    'todo.ombarnet.utbetalt.foreldrepenger.engangsstønad'
                                } /*TODO legge til info om at barnet er adoptert*/
                            />
                        }
                    />
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'todo.ombarnet.utbetalt.foreldrepenger.engangsstønad'}
                            />
                        }
                        søknadsvar={barn.utbetaltForeldrepengerEllerEngangsstønad.svar}
                    />
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.opplystatbarnutlandopphold.info'}
                                values={{ navn: barn.navn }}
                            />
                        }
                    />
                    {barn.utenlandsperioder.map((periode, index) => (
                        <UtenlandsperiodeOppsummering
                            key={index}
                            periode={periode}
                            nummer={index + 1}
                            barn={barn}
                        />
                    ))}
                    {barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd
                                        ]
                                    }
                                    values={{ barn: barn.navn }}
                                />
                            }
                            søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn[barnDataKeySpørsmål.kontantstøtteFraAnnetEøsland].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.barnetrygd-eøs'}
                                values={{ navn: barn.navn }}
                            />
                        }
                    />
                    {barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand
                                        ]
                                    }
                                />
                            }
                            søknadsvar={
                                barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar
                            }
                        />
                    )}
                    {barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand
                                        ]
                                    }
                                />
                            }
                            søknadsvar={landkodeTilSpråk(
                                barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar,
                                valgtLocale
                            )}
                        />
                    )}
                    {barn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte].svar && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.mottarEllerMottokEøsKontantstøtte
                                        ]
                                    }
                                />
                            }
                            søknadsvar={
                                barn[barnDataKeySpørsmål.mottarEllerMottokEøsKontantstøtte].svar
                            }
                        />
                    )}
                    {barn.eøsKontantstøttePerioder.map((periode, index) => (
                        <KontantstøttePeriodeOppsummering
                            key={`kontantstøtte-periode-søker-${index}`}
                            nummer={index + 1}
                            kontantstøttePeriode={periode}
                            barnetsNavn={barn.navn}
                            personType={PersonType.Søker}
                        />
                    ))}
                </StyledOppsummeringsFeltGruppe>
            )}
            {barn[barnDataKeySpørsmål.harBarnehageplass].svar === ESvar.JA && (
                <StyledOppsummeringsFeltGruppe>
                    {barn.barnehageplassPerioder.map((periode, index) => (
                        <BarnehageplassPeriodeOppsummering
                            key={`barnehageplass-periode-${index}`}
                            barnehageplassPeriode={periode}
                            nummer={index + 1}
                            barnetsNavn={barn.navn}
                        />
                    ))}
                </StyledOppsummeringsFeltGruppe>
            )}

            {barn.andreForelder && (
                <AndreForelderOppsummering andreForelder={barn.andreForelder} barn={barn} />
            )}
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt tittel={<SpråkTekst id={'ombarnet.bosted'} />} />

                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.borFastMedSøker]}
                            values={{ navn: barn.navn }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.borFastMedSøker].svar}
                />
                {barn.andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]
                    .svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted
                                    ]
                                }
                                values={{ navn: barn.navn }}
                            />
                        }
                        søknadsvar={
                            barn.andreForelder[
                                andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted
                            ].svar
                        }
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmBarnetOppsummering;
