import React from 'react';

import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { Upload } from '@navikt/ds-icons';
import { ABlue500, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
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
    const { onDrop, åpenModal, feilmeldinger, slettVedlegg } = useFilopplaster(
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

    const feilmeldingListe = Array.from(feilmeldinger).map(([key, value], index) => (
        <li key={index}>
            {plainTekst(key)}
            {
                <ul>
                    {value.map((fil, index) => (
                        <li key={index}>{fil.name}</li>
                    ))}
                </ul>
            }
        </li>
    ));

    return (
        <>
            <FilopplastningBoks type={'button'} {...getRootProps()} harFeil={åpenModal}>
                <input {...getInputProps()} />
                <StyledUpload focusable={false} />
                <Normaltekst>{plainTekst(isDragActive ? slippFilenHer : lastOppKnapp)}</Normaltekst>
            </FilopplastningBoks>
            {åpenModal && <StyledFeilmeldingList>{feilmeldingListe}</StyledFeilmeldingList>}
            <OpplastedeFiler
                filliste={dokumentasjon.opplastedeVedlegg}
                slettVedlegg={slettVedlegg}
            />
        </>
    );
};

export default Filopplaster;
