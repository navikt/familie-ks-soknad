import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { barnDataKeySpørsmål } from '../../../../typer/barn';
import { RouteEnum } from '../../../../typer/routes';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnaDineSpørsmålId, omBarnaDineSpørsmålSpråkId } from '../../OmBarnaDine/spørsmål';
import { useOmBarnaDine } from '../../OmBarnaDine/useOmBarnaDine';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmBarnaOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad } = useApp();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const omBarnaDineHook = useOmBarnaDine();

    const genererListeMedBarn = (søknadDatafelt: barnDataKeySpørsmål) =>
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadDatafelt].svar === ESvar.JA)
            .map(filtrertBarn => filtrertBarn.navn)
            .join(', ');

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmBarna)}
            tittel={'ombarna.sidetittel'}
            skjemaHook={omBarnaDineHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.erNoenAvBarnaFosterbarn.svar}
                />
                {søknad.erNoenAvBarnaFosterbarn.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemErFosterbarn
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erFosterbarn)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.oppholderBarnSegIInstitusjon.svar}
                />

                {søknad.oppholderBarnSegIInstitusjon.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.oppholderSegIInstitusjon
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.erBarnAdoptertFraUtland.svar}
                />
                {søknad.erBarnAdoptertFraUtland.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAdoptertFraUtland)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omBarnaDineSpørsmålSpråkId[OmBarnaDineSpørsmålId.søktAsylForBarn]}
                        />
                    }
                    søknadsvar={søknad.søktAsylForBarn.svar}
                />
                {søknad.søktAsylForBarn.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemErSøktAsylFor
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAsylsøker)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar}
                />

                {søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar === ESvar.NEI && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.boddMindreEnn12MndINorge
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                omBarnaDineSpørsmålSpråkId[
                                    OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar}
                />

                {søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === ESvar.JA && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    omBarnaDineSpørsmålSpråkId[
                                        OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland
                                    ]
                                }
                            />
                        }
                        søknadsvar={genererListeMedBarn(
                            barnDataKeySpørsmål.barnetrygdFraAnnetEøsland
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            {søknad.erAvdødPartnerForelder.svar && (
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={omBarnaDineSpørsmålSpråkId[søknad.erAvdødPartnerForelder.id]}
                            />
                        }
                        søknadsvar={søknad.erAvdødPartnerForelder.svar}
                    />

                    {søknad.erAvdødPartnerForelder.svar === ESvar.JA && (
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        omBarnaDineSpørsmålSpråkId[
                                            OmBarnaDineSpørsmålId.hvemAvdødPartner
                                        ]
                                    }
                                />
                            }
                            søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.andreForelderErDød)}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            )}
        </Oppsummeringsbolk>
    );
};

export default OmBarnaOppsummering;
