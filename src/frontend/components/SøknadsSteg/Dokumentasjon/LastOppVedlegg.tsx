import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import {
    dokumentasjonsbehovTilBeskrivelseSanityApiNavn,
    dokumentasjonsbehovTilTittelSanityApiNavn,
    EFiltyper,
    IDokumentasjon,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { slåSammen } from '../../../utils/slåSammen';
import TekstBlock from '../../Felleskomponenter/TekstBlock';
import Filopplaster from './filopplaster/Filopplaster';

interface Props {
    dokumentasjon: IDokumentasjon;
    vedleggNr: number;
    oppdaterDokumentasjon: (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const Container = styled.div`
    margin-bottom: 4rem;
`;

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjon, vedleggNr, oppdaterDokumentasjon }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const dokumentasjonstekster = tekster().DOKUMENTASJON;
    const intl = useIntl();
    const settHarSendtInnTidligere = (event: React.ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
    };

    const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
        dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
    );
    const barnasNavn = slåSammen(barnDokGjelderFor.map(barn => barn.navn));

    const antallVedlegg = () => {
        const dokSomKrevesForBarn = søknad.dokumentasjon.filter(dok => dok.gjelderForBarnId.length);
        let antallVedlegg = dokSomKrevesForBarn.length;

        const erOppholdtillatelseKravForSøkerMenIkkeBarn = søknad.dokumentasjon.find(
            dok =>
                dok.dokumentasjonsbehov === Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE &&
                !dok.gjelderForBarnId.length &&
                dok.gjelderForSøker
        );

        if (erOppholdtillatelseKravForSøkerMenIkkeBarn) {
            antallVedlegg++;
        }

        return antallVedlegg;
    };

    const tittelBlock =
        dokumentasjonstekster[
            dokumentasjonsbehovTilTittelSanityApiNavn(dokumentasjon.dokumentasjonsbehov)
        ];
    const dokTittel = <TekstBlock block={tittelBlock} flettefelter={{ barnetsNavn: barnasNavn }} />;

    const skalViseAnnenDokumentasjonsBeskrivelse = () => {
        return (
            dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON ||
            søknad.søker.sivilstand.type === ESivilstand.SKILT
        );
    };

    const dokumentasjonsbeskrivelse = dokumentasjonsbehovTilBeskrivelseSanityApiNavn(
        dokumentasjon.dokumentasjonsbehov
    );

    return (
        <Container>
            <Undertittel>
                {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                    <TekstBlock
                        block={dokumentasjonstekster.vedleggXavY}
                        flettefelter={{
                            antall: vedleggNr.toString(),
                            totaltAntall: antallVedlegg().toString(),
                        }}
                    />
                )}
                {dokTittel}
            </Undertittel>
            {dokumentasjonsbeskrivelse && skalViseAnnenDokumentasjonsBeskrivelse() && (
                <TekstBlock block={dokumentasjonstekster[dokumentasjonsbeskrivelse]} />
            )}
            {!dokumentasjon.harSendtInn && (
                <Filopplaster
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                    dokumentasjon={dokumentasjon}
                    maxFilstørrelse={1024 * 1024 * 10}
                    tillatteFiltyper={[EFiltyper.PNG, EFiltyper.PDF, EFiltyper.JPG, EFiltyper.JPEG]}
                />
            )}
            <br />
            {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                <Checkbox
                    label={plainTekst(dokumentasjonstekster.sendtInnTidligere)}
                    aria-label={`${intl.formatMessage({
                        id: 'dokumentasjon.har-sendt-inn.spm',
                    })} (${plainTekst(tittelBlock, { barnetsNavn: barnasNavn })})`}
                    checked={dokumentasjon.harSendtInn}
                    onChange={settHarSendtInnTidligere}
                />
            )}
        </Container>
    );
};

export default LastOppVedlegg;
