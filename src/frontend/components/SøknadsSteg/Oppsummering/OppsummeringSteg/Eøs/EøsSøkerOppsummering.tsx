import type { LocaleRecordBlock, LocaleRecordString } from '@common/typer/locale';
import { ArbeidsperiodeOppsummering } from '@components/Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '@components/Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import TekstBlock from '@components/Felleskomponenter/TekstBlock';
import { UtbetalingsperiodeOppsummering } from '@components/Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import IdNummerForSøker from '@components/SøknadsSteg/EøsSteg/Søker/IdNummerForSøker';
import { useEøsForSøker } from '@components/SøknadsSteg/EøsSteg/Søker/useEøsForSøker';
import { OppsummeringFelt } from '@components/SøknadsSteg/Oppsummering/OppsummeringFelt';
import Oppsummeringsbolk from '@components/SøknadsSteg/Oppsummering/Oppsummeringsbolk';
import { useAppContext } from '@context/AppContext';
import type { ESvar } from '@navikt/familie-form-elements';
import { PersonType } from '@typer/personType';
import { RouteEnum } from '@typer/routes';
import type { ISøknadSpørsmål } from '@typer/spørsmål';
import type { Dispatch, FC, SetStateAction } from 'react';
import { ROUTES } from '../../../../../routes';

interface Props {
    settFeilAnchors: Dispatch<SetStateAction<string[]>>;
}

const EøsSøkerOppsummering: FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useAppContext();
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
            steg={ROUTES[RouteEnum.EøsForSøker]}
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
