import React from 'react';

import styled from 'styled-components';

import { Checkbox, Heading } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
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

    const skalViseAnnenDokumentasjonsBeskrivelse = () => {
        return (
            dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON ||
            søknad.søker.sivilstand.type === ESivilstand.SKILT
        );
    };

    const dokumentasjonsbeskrivelse = dokumentasjonsbehovTilBeskrivelseSanityApiNavn(
        dokumentasjon.dokumentasjonsbehov
    );

    const vedleggXAvY = plainTekst(dokumentasjonstekster.vedleggXavY, {
        antall: vedleggNr.toString(),
        totalAntall: antallVedlegg().toString(),
    });
    const vedleggtittel =
        (dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
            ? vedleggXAvY
            : '') +
        ' ' +
        plainTekst(tittelBlock, { barnetsNavn: barnasNavn });

    return (
        <Container>
            <Heading level={'2'} size={'small'}>
                {vedleggtittel}
            </Heading>
            {dokumentasjonsbeskrivelse && skalViseAnnenDokumentasjonsBeskrivelse() && (
                <TekstBlock
                    data-testid={'dokumentasjonsbeskrivelse'}
                    block={dokumentasjonstekster[dokumentasjonsbeskrivelse]}
                    flettefelter={{ barnetsNavn: barnasNavn }}
                    typografi={Typografi.BodyLong}
                />
            )}
            {!dokumentasjon.harSendtInn && (
                <div data-testid={'dokumentopplaster'}>
                    <Filopplaster
                        oppdaterDokumentasjon={oppdaterDokumentasjon}
                        dokumentasjon={dokumentasjon}
                        maxFilstørrelse={1024 * 1024 * 10}
                        tillatteFiltyper={{
                            'image/*': [EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG],
                            'application/pdf': [EFiltyper.PDF],
                        }}
                    />
                </div>
            )}
            <br />
            {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                <Checkbox
                    data-testid={'dokumentasjon-er-sendt-inn-checkboks'}
                    aria-label={`${plainTekst(
                        dokumentasjonstekster.sendtInnTidligere
                    )} (${plainTekst(tittelBlock, { barnetsNavn: barnasNavn })})`}
                    checked={dokumentasjon.harSendtInn}
                    onChange={settHarSendtInnTidligere}
                >
                    {plainTekst(dokumentasjonstekster.sendtInnTidligere)}
                </Checkbox>
            )}
        </Container>
    );
};

export default LastOppVedlegg;
