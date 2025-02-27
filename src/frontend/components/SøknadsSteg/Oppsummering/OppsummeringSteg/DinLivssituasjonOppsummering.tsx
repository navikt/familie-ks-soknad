import React from 'react';

import { useApp } from '../../../../context/AppContext';
import { useRoutesContext } from '../../../../context/RoutesContext';
import { PersonType } from '../../../../typer/personType';
import { RouteEnum } from '../../../../typer/routes';
import { ArbeidsperiodeOppsummering } from '../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '../../../Felleskomponenter/TekstBlock';
import { UtenlandsperiodeOppsummering } from '../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useDinLivssituasjon } from '../../DinLivssituasjon/useDinLivssituasjon';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const DinLivssituasjonOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster } = useApp();
    const dinLivssituasjonTekster = tekster().DIN_LIVSSITUASJON;
    const { hentRouteObjektForRouteEnum } = useRoutesContext();
    const dinLivsituasjonHook = useDinLivssituasjon();

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.DinLivssituasjon)}
            tittel={dinLivssituasjonTekster.dinLivssituasjonTittel}
            skjemaHook={dinLivsituasjonHook}
            settFeilAnchors={settFeilAnchors}
        >
            <OppsummeringFelt
                tittel={<TekstBlock block={dinLivssituasjonTekster.asylsoeker.sporsmal} />}
                søknadsvar={søknad.søker.erAsylsøker.svar}
            />
            <OppsummeringFelt
                tittel={<TekstBlock block={dinLivssituasjonTekster.arbeidUtenforNorge.sporsmal} />}
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
                tittel={
                    <TekstBlock
                        block={dinLivssituasjonTekster.utenlandsoppholdUtenArbeid.sporsmal}
                    />
                }
                søknadsvar={søknad.søker.utenlandsoppholdUtenArbeid.svar}
            />

            {søknad.søker.utenlandsperioder.map((periode, index) => (
                <UtenlandsperiodeOppsummering
                    key={index}
                    periode={periode}
                    nummer={index + 1}
                    personType={PersonType.søker}
                />
            ))}

            <OppsummeringFelt
                tittel={<TekstBlock block={dinLivssituasjonTekster.pensjonUtland.sporsmal} />}
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
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
