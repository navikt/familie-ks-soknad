import React from 'react';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { PersonType } from '../../../../typer/personType';
import { RouteEnum } from '../../../../typer/routes';
import { ArbeidsperiodeOppsummering } from '../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import { useDinLivssituasjon } from '../../DinLivssituasjon/useDinLivssituasjon';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const DinLivssituasjonOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster } = useApp();
    const dinLivssituasjonTekster = tekster().DIN_LIVSSITUASJON;
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const dinLivsituasjonHook = useDinLivssituasjon();

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.DinLivssituasjon)}
            tittel={'dinlivssituasjon.sidetittel'}
            skjemaHook={dinLivsituasjonHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    spørsmålstekst={dinLivssituasjonTekster.asylsoeker.sporsmal}
                    søknadsvar={søknad.søker.erAsylsøker.svar}
                />
                <OppsummeringFelt
                    spørsmålstekst={dinLivssituasjonTekster.arbeidUtenforNorge.sporsmal}
                    søknadsvar={søknad.søker.arbeidIUtlandet.svar}
                />

                {søknad.søker.arbeidsperioderUtland.map((periode, index) => (
                    <ArbeidsperiodeOppsummering
                        key={`arbeidsperiode-${index}`}
                        nummer={index + 1}
                        arbeidsperiode={periode}
                        gjelderUtlandet={true}
                        personType={PersonType.søker}
                    />
                ))}

                <OppsummeringFelt
                    spørsmålstekst={dinLivssituasjonTekster.pensjonUtland.sporsmal}
                    søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
                />

                {søknad.søker.pensjonsperioderUtland.map((periode, index) => (
                    <PensjonsperiodeOppsummering
                        key={`utenlandsperiode-${index}`}
                        nummer={index + 1}
                        pensjonsperiode={periode}
                        gjelderUtlandet={true}
                        personType={PersonType.søker}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
