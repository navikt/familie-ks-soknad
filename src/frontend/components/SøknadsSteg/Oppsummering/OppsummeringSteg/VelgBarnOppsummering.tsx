import { type Dispatch, type FC, Fragment, type SetStateAction } from 'react';

import { useAppContext } from '../../../../context/AppContext';
import { useRoutesContext } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { hentBostedSpråkId } from '../../../../utils/språk';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import type { IVelgBarnTekstinnhold } from '../../VelgBarn/innholdTyper';
import { useVelgBarn } from '../../VelgBarn/useVelgBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: Dispatch<SetStateAction<string[]>>;
}

const VelgBarnOppsummering: FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useAppContext();
    const velgBarnTekster = tekster().VELG_BARN;
    const leggTilBarnModalTekster = tekster()[ESanitySteg.FELLES].modaler.leggTilBarn;
    const { hentRouteObjektForRouteEnum } = useRoutesContext();
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
                <Fragment key={index}>
                    <OppsummeringFelt
                        tittel={<TekstBlock block={leggTilBarnModalTekster.barnetsNavnSubtittel} />}
                        søknadsvar={
                            barn.adressebeskyttelse ? plainTekst(velgBarnTekster.registrertMedAdressesperre) : barn.navn
                        }
                    />

                    <OppsummeringFelt
                        tittel={<TekstBlock block={velgBarnTekster.foedselsnummerLabel} />}
                        søknadsvar={barn.ident}
                    />

                    {!søknad.barnRegistrertManuelt.find(
                        barnRegistrertManuelt => barnRegistrertManuelt.ident === barn.ident
                    ) && (
                        <OppsummeringFelt
                            tittel={<TekstBlock block={velgBarnTekster.registrertBostedLabel} />}
                            søknadsvar={plainTekst(hentBostedSpråkId(barn, teksterForSteg))}
                        />
                    )}
                </Fragment>
            ))}
        </Oppsummeringsbolk>
    );
};

export default VelgBarnOppsummering;
