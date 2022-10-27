import React from 'react';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { IVelgBarnTekstinnhold } from '../../VelgBarn/innholdTyper';
import { useVelgBarn } from '../../VelgBarn/useVelgBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const VelgBarnOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const velgBarnTekster = tekster().VELG_BARN;
    const leggTilBarnModalTekster = tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const velgBarnHook = useVelgBarn();
    const teksterForSteg: IVelgBarnTekstinnhold = tekster()[ESanitySteg.VELG_BARN];

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.VelgBarn)}
            tittel={velgBarnTekster.velgBarnTittel}
            skjemaHook={velgBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            {søknad.barnInkludertISøknaden.map((barn, index) => (
                <StyledOppsummeringsFeltGruppe key={index}>
                    <OppsummeringFelt
                        spørsmålstekst={leggTilBarnModalTekster.barnetsNavnSubtittel}
                        søknadsvar={
                            barn.adressebeskyttelse
                                ? plainTekst(velgBarnTekster.registrertMedAdressesperre)
                                : barn.navn
                        }
                    />

                    <OppsummeringFelt
                        spørsmålstekst={velgBarnTekster.foedselsnummerLabel}
                        søknadsvar={barn.ident}
                    />

                    {!søknad.barnRegistrertManuelt.find(
                        barnRegistrertManuelt => barnRegistrertManuelt.ident === barn.ident
                    ) && (
                        <OppsummeringFelt
                            spørsmålstekst={velgBarnTekster.registrertBostedLabel}
                            søknadsvar={plainTekst(hentBostedSpråkId(barn, teksterForSteg))}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            ))}
        </Oppsummeringsbolk>
    );
};

export default VelgBarnOppsummering;
