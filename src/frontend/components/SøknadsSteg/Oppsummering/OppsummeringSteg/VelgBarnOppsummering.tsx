import React from 'react';

import { useIntl } from 'react-intl';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { IVelgBarnTekstinnhold } from '../../VelgBarn/innholdTyper';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from '../../VelgBarn/spørsmål';
import { useVelgBarn } from '../../VelgBarn/useVelgBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const VelgBarnOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { formatMessage } = useIntl();
    const { søknad, tekster, plainTekst } = useApp();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const velgBarnHook = useVelgBarn();
    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.VelgBarn)}
            tittel={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.velgBarn]}
            skjemaHook={velgBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            {søknad.barnInkludertISøknaden.map((barn, index) => (
                <StyledOppsummeringsFeltGruppe key={index}>
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.barnetsNavn]}
                            />
                        }
                        søknadsvar={
                            barn.adressebeskyttelse
                                ? formatMessage({
                                      id: 'hvilkebarn.barn.bosted.adressesperre',
                                  })
                                : barn.navn
                        }
                    />

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'hvilkebarn.barn.fødselsnummer'} />}
                        søknadsvar={barn.ident}
                    />

                    {!søknad.barnRegistrertManuelt.find(
                        barnRegistrertManuelt => barnRegistrertManuelt.ident === barn.ident
                    ) && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'hvilkebarn.barn.bosted'} />}
                            søknadsvar={plainTekst(hentBostedSpråkId(barn, teksterForSteg))}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            ))}
        </Oppsummeringsbolk>
    );
};

export default VelgBarnOppsummering;
