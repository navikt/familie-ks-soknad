import React from 'react';

import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { UploadIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';
import { ABlue500, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { useAppContext } from '../../../../context/AppContext';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';

import OpplastedeFiler from './OpplastedeFiler';
import { useFilopplaster } from './useFilopplaster';

interface Props {
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
    dokumentasjon: IDokumentasjon;
    tillatteFiltyper: { [key: string]: string[] };
}

interface FilopplastningBoksProps {
    $harFeil: boolean;
}

const FilopplastningBoks = styled.button<FilopplastningBoksProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed ${props => (props.$harFeil ? '#ba3a26' : ABorderDefault)};
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    width: 100%;
    padding: 1rem;
    color: ${ABlue500};
    box-sizing: border-box;

    &:focus,
    &:hover {
        border: 2px solid ${props => (props.$harFeil ? '#ba3a26' : ABlue500)};
        cursor: pointer;
    }
`;

const StyledUpload = styled(UploadIcon)`
    margin-right: 1rem;
    min-width: 1rem;
    font-size: 1.5rem;
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
}) => {
    const { onDrop, harFeil, feilmeldinger, slettVedlegg } = useFilopplaster(
        dokumentasjon,
        oppdaterDokumentasjon
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: tillatteFiltyper,
    });

    const { tekster, plainTekst } = useAppContext();
    const { lastOppKnapp, slippFilenHer } = tekster().DOKUMENTASJON;

    return (
        <VStack gap="4">
            <FilopplastningBoks type={'button'} {...getRootProps()} $harFeil={harFeil}>
                <input {...getInputProps()} />
                <StyledUpload focusable={false} aria-hidden />
                <BodyShort>{plainTekst(isDragActive ? slippFilenHer : lastOppKnapp)}</BodyShort>
            </FilopplastningBoks>

            {dokumentasjon.opplastedeVedlegg.length > 0 && (
                <OpplastedeFiler
                    filliste={dokumentasjon.opplastedeVedlegg}
                    slettVedlegg={slettVedlegg}
                />
            )}

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
        </VStack>
    );
};

export default Filopplaster;
