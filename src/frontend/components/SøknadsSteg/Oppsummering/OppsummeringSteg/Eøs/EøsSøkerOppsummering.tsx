import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../../context/AppContext';
import { useRoutes } from '../../../../../context/RoutesContext';
import { LocaleRecordBlock, LocaleRecordString } from '../../../../../typer/common';
import { PersonType } from '../../../../../typer/personType';
import { RouteEnum } from '../../../../../typer/routes';
import { ISøknadSpørsmål } from '../../../../../typer/spørsmål';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '../../../../Felleskomponenter/TekstBlock';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import IdNummerForSøker from '../../../EøsSteg/Søker/IdNummerForSøker';
import { useEøsForSøker } from '../../../EøsSteg/Søker/useEøsForSøker';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const EøsSøkerOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const { søknad, tekster, plainTekst } = useApp();
    const eøsSøkerTekster = tekster().EØS_FOR_SØKER;
    const { søker } = søknad;
    const eøsForSøkerHook = useEøsForSøker();

    const jaNeiSpmOppsummering = ({
        søknadSvar,
        spørsmålstekst,
    }: {
        spørsmålstekst: LocaleRecordBlock | LocaleRecordString;
        søknadSvar: ISøknadSpørsmål<ESvar | null>;
    }) => <OppsummeringFelt tittel={plainTekst(spørsmålstekst)} søknadsvar={søknadSvar.svar} />;

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.EøsForSøker)}
            tittel={eøsSøkerTekster.eoesForSoekerTittel}
            skjemaHook={eøsForSøkerHook}
            settFeilAnchors={settFeilAnchors}
        >
            <IdNummerForSøker
                skjema={eøsForSøkerHook.skjema}
                settIdNummerFelter={eøsForSøkerHook.settIdNummerFelter}
                lesevisning={true}
            />
            {søker.adresseISøkeperiode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={eøsSøkerTekster.hvorBor.sporsmal} />}
                    søknadsvar={søker.adresseISøkeperiode.svar}
                />
            )}
            {jaNeiSpmOppsummering({
                spørsmålstekst: eøsSøkerTekster.arbeidNorge.sporsmal,
                søknadSvar: søker.arbeidINorge,
            })}
            {søker.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-søker-norge-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.søker}
                    gjelderUtlandet={false}
                />
            ))}

            {jaNeiSpmOppsummering({
                spørsmålstekst: eøsSøkerTekster.pensjonNorge.sporsmal,
                søknadSvar: søker.pensjonNorge,
            })}
            {søker.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-søker-norge-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    gjelderUtlandet={false}
                    personType={PersonType.søker}
                />
            ))}

            {jaNeiSpmOppsummering({
                spørsmålstekst: eøsSøkerTekster.utbetalinger.sporsmal,
                søknadSvar: søker.andreUtbetalinger,
            })}
            {søker.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                <UtbetalingsperiodeOppsummering
                    key={`utbetalingsperiode-søker-norge-${index}`}
                    utbetalingsperiode={utbetalingsperiode}
                    nummer={index + 1}
                    personType={PersonType.søker}
                />
            ))}
        </Oppsummeringsbolk>
    );
};

export default EøsSøkerOppsummering;
