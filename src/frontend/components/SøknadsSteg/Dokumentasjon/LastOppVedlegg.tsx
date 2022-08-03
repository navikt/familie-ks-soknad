import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { EFiltyper, IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
    const { søknad } = useApp();
    const intl = useIntl();
    const settHarSendtInnTidligere = (event: React.ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
    };

    const formatertListeMedBarn = () => {
        const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
            dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
        );

        return barnDokGjelderFor.map((barn, index) => {
            const visningsNavn = barn.navn;
            if (index === 0) {
                return visningsNavn;
            } else {
                return index === barnDokGjelderFor.length - 1
                    ? ` ${intl.formatMessage({ id: 'felles.og' })} ${visningsNavn}`
                    : `, ${visningsNavn}`;
            }
        });
    };

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

    const dokTittel = (
        <SpråkTekst id={dokumentasjon.tittelSpråkId} values={{ barn: formatertListeMedBarn() }} />
    );

    const skalViseAnnenDokumentasjonsBeskrivelse = () => {
        return (
            dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON ||
            søknad.søker.sivilstand.type === ESivilstand.SKILT
        );
    };

    return (
        <Container>
            <Undertittel>
                {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                    <>
                        <SpråkTekst
                            id={'dokumentasjon.vedleggsnummer'}
                            values={{
                                vedleggsnummer: vedleggNr,
                                antallvedlegg: antallVedlegg(),
                            }}
                        />
                        &nbsp;
                    </>
                )}
                {dokTittel}
            </Undertittel>
            {dokumentasjon.beskrivelseSpråkId && skalViseAnnenDokumentasjonsBeskrivelse() && (
                <>
                    <SpråkTekst
                        id={dokumentasjon.beskrivelseSpråkId}
                        values={{
                            barn: formatertListeMedBarn(),
                            meklingsattestLenke: (
                                <EksternLenke
                                    lenkeSpråkId={'dokumentasjon.meklingsattest.lenke'}
                                    lenkeTekstSpråkId={'dokumentasjon.meklingsattest.lenketekst'}
                                    target="_blank"
                                />
                            ),
                        }}
                    />
                </>
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
                    label={<SpråkTekst id={'dokumentasjon.har-sendt-inn.spm'} />}
                    aria-label={`${intl.formatMessage({
                        id: 'dokumentasjon.har-sendt-inn.spm',
                    })} (${dokTittel})`}
                    checked={dokumentasjon.harSendtInn}
                    onChange={settHarSendtInnTidligere}
                />
            )}
        </Container>
    );
};

export default LastOppVedlegg;
