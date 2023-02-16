import React from 'react';

import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { Upload } from '@navikt/ds-icons';
import { Modal } from '@navikt/ds-react';
import { NavdsGlobalColorBlue500, NavdsSemanticColorBorder } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import AlertStripe from '../../../Felleskomponenter/AlertStripe/AlertStripe';
import ModalContent from '../../../Felleskomponenter/ModalContent';
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

const FilopplastningBoks = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed ${NavdsSemanticColorBorder};
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    width: 100%;
    padding: 1rem;
    margin: 2rem 0 1rem 0;
    color: ${NavdsGlobalColorBlue500};
    box-sizing: border-box;

    :focus,
    :hover {
        border: 2px solid ${NavdsGlobalColorBlue500};
        cursor: pointer;
    }
`;

const StyledUpload = styled(Upload)`
    margin-right: 1rem;
    min-width: 1rem;
`;

const FeilmeldingWrapper = styled.div`
    margin-right: 3rem;
`;

const Filopplaster: React.FC<Props> = ({
    oppdaterDokumentasjon,
    dokumentasjon,
    tillatteFiltyper,
    maxFilstørrelse,
}) => {
    const { onDrop, åpenModal, lukkModal, feilmeldinger, slettVedlegg } = useFilopplaster(
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
            <Modal
                open={åpenModal}
                onClose={() => lukkModal()}
                closeButton={true}
                aria-label={plainTekst(lastOppKnapp)}
            >
                <ModalContent>
                    <FeilmeldingWrapper>
                        {feilmeldinger.map((feilmelding, index) => (
                            <AlertStripe variant={'error'} key={index} inline={false}>
                                {feilmelding}
                            </AlertStripe>
                        ))}
                    </FeilmeldingWrapper>
                </ModalContent>
            </Modal>
            <FilopplastningBoks type={'button'} {...getRootProps()}>
                <input {...getInputProps()} />
                <StyledUpload focusable={false} />
                <Normaltekst>{plainTekst(isDragActive ? slippFilenHer : lastOppKnapp)}</Normaltekst>
            </FilopplastningBoks>
            <OpplastedeFiler
                filliste={dokumentasjon.opplastedeVedlegg}
                slettVedlegg={slettVedlegg}
            />
        </>
    );
};

export default Filopplaster;
