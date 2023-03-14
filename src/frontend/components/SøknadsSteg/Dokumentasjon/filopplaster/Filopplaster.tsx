import React from 'react';

import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { Upload } from '@navikt/ds-icons';
import { ABlue500, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { Typografi } from '../../../../typer/common';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { TypografiWrapper } from '../../../Felleskomponenter/TekstBlock';
import OpplastedeFiler from './OpplastedeFiler';
import { useFilopplaster } from './useFilopplaster';

interface Props {
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
    dokumentasjon: IDokumentasjon;
    tillatteFiltyper: string[];
    maxFilstørrelse: number;
}

interface FilopplastningBoksProps {
    harFeil: boolean;
}

const FilopplastningBoks = styled.button<FilopplastningBoksProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed ${props => (props.harFeil ? '#ba3a26' : ABorderDefault)};
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    width: 100%;
    padding: 1rem;
    margin: 2rem 0 1rem 0;
    color: ${ABlue500};
    box-sizing: border-box;

    :focus,
    :hover {
        border: 2px solid ${props => (props.harFeil ? '#ba3a26' : ABlue500)};
        cursor: pointer;
    }
`;

const StyledUpload = styled(Upload)`
    margin-right: 1rem;
    min-width: 1rem;
`;

const StyledFeilmeldingList = styled.ul`
    padding-inline-start: 1.25rem;
    > li {
        font-weight: 600;
        color: #ba3a26;
    }
`;

const Filopplaster: React.FC<Props> = ({
    oppdaterDokumentasjon,
    dokumentasjon,
    tillatteFiltyper,
    maxFilstørrelse,
}) => {
    const { onDrop, harFeil, feilmeldinger, slettVedlegg } = useFilopplaster(
        maxFilstørrelse,
        dokumentasjon,
        oppdaterDokumentasjon
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: tillatteFiltyper,
    });
    const { tekster, plainTekst } = useApp();
    const { lastOppKnapp, slippFilenHer } = tekster().DOKUMENTASJON;

    return (
        <>
            <FilopplastningBoks type={'button'} {...getRootProps()} harFeil={harFeil}>
                <input {...getInputProps()} />
                <StyledUpload focusable={false} />
                <TypografiWrapper typografi={Typografi.BodyShort}>
                    {plainTekst(isDragActive ? slippFilenHer : lastOppKnapp)}
                </TypografiWrapper>
            </FilopplastningBoks>
            <OpplastedeFiler
                filliste={dokumentasjon.opplastedeVedlegg}
                slettVedlegg={slettVedlegg}
            />
            {harFeil && (
                <StyledFeilmeldingList>
                    {Array.from(feilmeldinger).map(([key, value], index) => (
                        <li key={index}>
                            {plainTekst(key)}
                            {
                                <StyledFeilmeldingList>
                                    {value.map((fil, index) => (
                                        <li key={index}>{fil.name}</li>
                                    ))}
                                </StyledFeilmeldingList>
                            }
                        </li>
                    ))}
                </StyledFeilmeldingList>
            )}
        </>
    );
};

export default Filopplaster;
