import React from 'react';

import { Checkbox, FormSummary, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/common';
import {
    dokumentasjonsbehovTilBeskrivelseSanityApiNavn,
    dokumentasjonsbehovTilTittelSanityApiNavn,
    EFiltyper,
    IDokumentasjon,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { slåSammen } from '../../../utils/slåSammen';
import TekstBlock from '../../Felleskomponenter/TekstBlock';

import Filopplaster from './filopplaster/Filopplaster';

interface Props {
    dokumentasjon: IDokumentasjon;
    oppdaterDokumentasjon: (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
    const { søknad, tekster, plainTekst } = useAppContext();
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

    const tittelBlock =
        dokumentasjonstekster[
            dokumentasjonsbehovTilTittelSanityApiNavn(dokumentasjon.dokumentasjonsbehov)
        ];

    const dokumentasjonsbeskrivelse = dokumentasjonsbehovTilBeskrivelseSanityApiNavn(
        dokumentasjon.dokumentasjonsbehov
    );

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level={'3'}>
                    {plainTekst(tittelBlock, { barnetsNavn: barnasNavn })}
                </FormSummary.Heading>
            </FormSummary.Header>
            <VStack gap="6" paddingInline="6" paddingBlock="5 6">
                {dokumentasjonsbeskrivelse && (
                    <div>
                        <TekstBlock
                            data-testid={'dokumentasjonsbeskrivelse'}
                            block={dokumentasjonstekster[dokumentasjonsbeskrivelse]}
                            flettefelter={{ barnetsNavn: barnasNavn }}
                            typografi={Typografi.BodyLong}
                        />
                    </div>
                )}

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

                {!dokumentasjon.harSendtInn && (
                    <div data-testid={'dokumentopplaster'}>
                        <Filopplaster
                            oppdaterDokumentasjon={oppdaterDokumentasjon}
                            dokumentasjon={dokumentasjon}
                            tillatteFiltyper={{
                                'image/*': [EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG],
                                'application/pdf': [EFiltyper.PDF],
                            }}
                        />
                    </div>
                )}
            </VStack>
        </FormSummary>
    );
};

export default LastOppVedlegg;
