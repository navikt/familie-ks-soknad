import { ArbeidsperiodeOppsummering } from '@components/Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '@components/Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import { UtenlandsperiodeOppsummering } from '@components/Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useDinLivssituasjon } from '@components/SøknadsSteg/DinLivssituasjon/useDinLivssituasjon';
import { OppsummeringFelt } from '@components/SøknadsSteg/Oppsummering/OppsummeringFelt';
import Oppsummeringsbolk from '@components/SøknadsSteg/Oppsummering/Oppsummeringsbolk';
import { useAppContext } from '@context/AppContext';
import { PersonType } from '@typer/personType';
import { RouteEnum } from '@typer/routes';
import type { Dispatch, FC, SetStateAction } from 'react';
import { ROUTES } from '../../../../routes';

interface Props {
    settFeilAnchors: Dispatch<SetStateAction<string[]>>;
}

const DinLivssituasjonOppsummering: FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster } = useAppContext();
    const dinLivssituasjonTekster = tekster().DIN_LIVSSITUASJON;
    const dinLivsituasjonHook = useDinLivssituasjon();

    return (
        <Oppsummeringsbolk
            steg={ROUTES[RouteEnum.DinLivssituasjon]}
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
                tittel={<TekstBlock block={dinLivssituasjonTekster.utenlandsoppholdUtenArbeid.sporsmal} />}
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
